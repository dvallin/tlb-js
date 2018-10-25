import { Tunneller, PositionedTunneller } from "../../src/systems/tunneller"
import { Action } from "../../src/components/tunneller"
import { World } from "../../src/ecs/world"
import { TlbWorld } from "../../src/tlb"

import { mockRandom, mockMap, mockComponent, mockReturnValue, mockReturnValues, mockImplementation2 } from "../mocks"
import { Vector } from "../../src/spatial/vector"
import { WorldMap } from "../../src/resources/world-map"
import { Direction } from "../../src/spatial/direction"
import { Rectangle } from "../../src/geometry/rectangle";

describe("Tunneller", () => {

    let world: TlbWorld
    beforeEach(() => {
        world = new World()
    })

    describe("createAction", () => {

        it("renders if free", () => {
            const tunneller = new Tunneller(mockRandom())
            const map = mockMap(world)

            mockReturnValue(map.isShapeFree, true)

            expect(tunneller.createAction(world, emptyState())).toEqual("render")
            expect(map.isShapeFree).toHaveBeenCalledTimes(1)
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(31, 43, 2, 1))
        })

        it("closes after more moves than maximum age", () => {
            const tunneller = new Tunneller(mockRandom(), 2)
            const map = mockMap(world)
            mockReturnValue(map.isShapeFree, true)

            expect(tunneller.createAction(world, stateOfActions(["move", "move", "move"]))).toEqual("close")
            expect(tunneller.createAction(world, stateOfActions(["move", "changeDirection", "move", "move"]))).toEqual("close")
            expect(tunneller.createAction(world, stateOfActions(["move", "move"]))).toEqual("render")
            expect(tunneller.createAction(world, stateOfActions(["move", "changeDirection", "move"]))).toEqual("render")
        })

        it("changes direction if enough moves and decision is true", () => {
            const random = mockRandom()
            const tunneller = new Tunneller(random)
            const map = mockMap(world)
            mockReturnValue(random.decision, true)
            mockReturnValue(map.isFree, false)

            expect(tunneller.createAction(world, stateOfActions(["move", "move", "move"]))).toEqual("changeDirection")
            expect(tunneller.createAction(world, stateOfActions(
                ["move", "changeDirection", "move", "move", "move"]))
            ).toEqual("changeDirection")
            expect(tunneller.createAction(world, stateOfActions(["move", "move"]))).toEqual("close")
            expect(tunneller.createAction(world, stateOfActions(["move", "move", "move", "changeDirection", "move"]))).toEqual("close")
        })

        it("moves if next position is free", () => {
            const random = mockRandom()
            const tunneller = new Tunneller(random)
            const map = mockMap(world)
            mockReturnValue(random.decision, false)
            mockReturnValues(map.isShapeFree, false, true)

            const nextAction = tunneller.createAction(world, stateOfActions(["move", "move", "move"]))
            expect(nextAction).toEqual("move")
            expect(map.isShapeFree).toHaveBeenCalledTimes(2)
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(31, 43, 2, 1))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(31, 42, 2, 1))
        })

        it("closes if next position is not free", () => {
            const random = mockRandom()
            const tunneller = new Tunneller(random)
            const map = mockMap(world)
            mockReturnValue(random.decision, false)
            mockReturnValues(map.isFree, false, false)

            expect(tunneller.createAction(world, stateOfActions(["move", "move", "move"]))).toEqual("close")
        })
    })

    describe("takeAction", () => {

        it("renders", () => {
            const state = emptyState()
            const tunneller = new Tunneller(mockRandom())
            tunneller.render = jest.fn()

            tunneller.takeAction(world, 42, state, "render")

            expect(state.tunneller.actions).toEqual(["render"])
        })

        it("moves", () => {
            const state = emptyState()
            const tunneller = new Tunneller(mockRandom())
            const positions = mockComponent(world, "position")
            tunneller.move = jest.fn().mockReturnValue(new Vector(2, 3))

            tunneller.takeAction(world, 42, state, "move")

            expect(positions.insert).toHaveBeenCalledWith(
                42, { position: new Vector(2, 3) }
            )
            expect(state.tunneller.actions).toEqual(["move"])
        })

        it("changes direction", () => {
            const state = emptyState()
            const tunneller = new Tunneller(mockRandom())
            const tunnellers = mockComponent(world, "tunneller")
            const positions = mockComponent(world, "position")
            tunneller.changeDirection = jest.fn().mockReturnValue({ direction: "left", position: new Vector(2, 3) })

            tunneller.takeAction(world, 42, state, "changeDirection")

            expect(tunnellers.insert).toHaveBeenCalledWith(
                42, { actions: ["changeDirection"], direction: "left", width: 2 }
            )
            expect(positions.insert).toHaveBeenCalledWith(
                42, { position: new Vector(2, 3) }
            )
            expect(state.tunneller.actions).toEqual(["changeDirection"])
        })

        it("closes tunneller", () => {
            world.deleteEntity = jest.fn()
            const state = emptyState()
            const tunneller = new Tunneller(mockRandom())

            tunneller.takeAction(world, 42, state, "close")

            expect(world.deleteEntity).toHaveBeenCalledWith(42)
            expect(state.tunneller.actions).toEqual(["close"])
        })
    })

    describe("changeDirection", () => {

        it("turns right if all is free", () => {
            const tunneller = new Tunneller(mockRandom())
            const map = mockMap(world)
            mockReturnValue(map.isFree, true)

            expect(tunneller.changeDirection(world, stateOfDirection("up")).direction).toEqual("right")
            expect(tunneller.changeDirection(world, stateOfDirection("right")).direction).toEqual("down")
            expect(tunneller.changeDirection(world, stateOfDirection("down")).direction).toEqual("left")
            expect(tunneller.changeDirection(world, stateOfDirection("left")).direction).toEqual("up")
        })

        it("turns left if there is more room", () => {
            const tunneller = new Tunneller(mockRandom())
            const map = mockMap(world)
            mockImplementation2(map.isShapeFree, ({ }: TlbWorld, r: Rectangle) => {
                return r.left === 30 && r.height === 4
            })

            expect(tunneller.changeDirection(world, stateOfDirection("up")).direction).toEqual("left")
        })

        it("keeps going forward if there is more room", () => {
            const tunneller = new Tunneller(mockRandom())
            const map = mockMap(world)
            mockImplementation2(map.isShapeFree, ({ }: TlbWorld, r: Rectangle) => {
                return r.top === 42 && r.width === 4
            })

            expect(tunneller.changeDirection(world, stateOfDirection("up")).direction).toEqual("up")
        })

        it("checks correct surrounding in up direction", () => {
            const tunneller = new Tunneller(mockRandom())
            const map = mockMap(world)
            mockReturnValue(map.isShapeFree, false)
            tunneller.changeDirection(world, stateOfDirection("up"))
            expect(map.isShapeFree).toHaveBeenCalledTimes(3)
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(33, 42, 1, 4))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(30, 42, 1, 4))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(30, 42, 4, 1))
        })

        it("checks correct surrounding in down direction", () => {
            const tunneller = new Tunneller(mockRandom())
            const map = mockMap(world)
            mockReturnValue(map.isShapeFree, false)
            tunneller.changeDirection(world, stateOfDirection("down"))
            expect(map.isShapeFree).toHaveBeenCalledTimes(3)
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(30, 41, 1, 4))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(33, 41, 1, 4))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(30, 44, 4, 1))
        })

        it("checks correct surrounding in right direction", () => {
            const tunneller = new Tunneller(mockRandom())
            const map = mockMap(world)
            mockReturnValue(map.isFree, false)
            tunneller.changeDirection(world, stateOfDirection("right"))
            expect(map.isShapeFree).toHaveBeenCalledTimes(3)
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(33, 41, 1, 4))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(30, 41, 4, 1))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(30, 44, 4, 1))
        })

        it("checks correct surrounding in left direction", () => {
            const tunneller = new Tunneller(mockRandom())
            const map = mockMap(world)
            mockReturnValue(map.isShapeFree, false)
            tunneller.changeDirection(world, stateOfDirection("left"))
            expect(map.isShapeFree).toHaveBeenCalledTimes(3)
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(31, 41, 1, 4))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(31, 44, 4, 1))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(31, 41, 4, 1))
        })
    })

    describe("footprint", () => {

        let map: WorldMap
        beforeEach(() => {
            map = mockMap(world)
            mockReturnValue(map.isShapeFree, true)
        })

        it("is just position if width is 1", () => {
            const tunneller = new Tunneller(mockRandom())
            tunneller.createAction(world, stateOfWidth(1))

            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(32, 43, 1, 1))
        })

        it("is left and position if width is 2", () => {
            const tunneller = new Tunneller(mockRandom())
            tunneller.createAction(world, stateOfWidth(2))

            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(31, 43, 2, 1))
        })

        it("is left, right and position if width is 3", () => {
            const tunneller = new Tunneller(mockRandom())
            tunneller.createAction(world, stateOfWidth(3))

            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(31, 43, 3, 1))
        })
    })
})

function emptyState(): PositionedTunneller {
    return {
        position: { position: new Vector(32, 43) },
        tunneller: {
            actions: [],
            direction: "up",
            width: 2
        }
    }
}

function stateOfDirection(direction: Direction): PositionedTunneller {
    const state = emptyState()
    state.tunneller.direction = direction
    return state
}

function stateOfActions(actions: Action[]): PositionedTunneller {
    const state = emptyState()
    state.tunneller.actions = actions
    return state
}

function stateOfWidth(width: number): PositionedTunneller {
    const state = emptyState()
    state.tunneller.width = width
    return state
}
