import { Tunneller, PositionedTunneller } from "../../src/systems/tunneller"
import { Action } from "../../src/components/tunneller"
import { World } from "../../src/ecs/world"
import { TlbWorld } from "../../src/tlb"

import { mockRandom, mockMap, mockComponent, mockReturnValue, mockReturnValues, mockImplementation2 } from "../mocks"
import { Vector } from "../../src/spatial/vector"
import { WorldMap } from "../../src/resources/world-map"
import { Direction } from "../../src/spatial/direction"
import { Rectangle } from "../../src/geometry/rectangle"
import { Random } from "../../src/random";
import { Room } from "../../src/artifacts/rooms";

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

        it("changes direction if enough moves taken", () => {
            const random = mockRandom()
            const tunneller = new Tunneller(random)
            tunneller.freeCells = jest.fn().mockReturnValue(1)
            const map = mockMap(world)
            mockReturnValue(map.isFree, false)

            expect(tunneller.createAction(world, stateOfActions(["move", "move", "move"]))).toEqual("changeDirection")
            expect(tunneller.createAction(world, stateOfActions(
                ["move", "changeDirection", "move", "move", "move"]))
            ).toEqual("changeDirection")
            expect(tunneller.createAction(world, stateOfActions(["move", "move"]))).not.toEqual("changeDirection")
            expect(tunneller.createAction(world, stateOfActions(["move", "move", "move", "changeDirection", "move"])))
                .not.toEqual("changeDirection")
        })

        it("does not change direction if enough free cells", () => {
            const random = mockRandom()
            const tunneller = new Tunneller(random)
            tunneller.freeCells = jest.fn().mockReturnValue(2)
            const map = mockMap(world)
            mockReturnValue(map.isFree, false)

            expect(tunneller.createAction(world, stateOfActions(["move", "move", "move"]))).not.toEqual("changeDirection")
        })

        it("creates room if enough moves and no reason to change direction and random decision is true", () => {
            const random = mockRandom()
            const tunneller = new Tunneller(random)
            const map = mockMap(world)
            tunneller.freeCells = jest.fn().mockReturnValue(2)
            mockReturnValue(random.decision, true)
            mockReturnValue(map.isFree, false)

            expect(tunneller.createAction(world, stateOfActions(["move", "move", "move"]))).toEqual("createRoom")
        })

        it("moves if next position is free", () => {
            const random = mockRandom()
            const tunneller = new Tunneller(random)
            tunneller.freeCells = jest.fn().mockReturnValue(2)
            const map = mockMap(world)
            mockReturnValues(map.isShapeFree, false, true)

            const nextAction = tunneller.createAction(world, stateOfActions(["move", "move", "move"]))
            expect(nextAction).toEqual("move")
        })

        it("closes if next position is not free", () => {
            const random = mockRandom()
            const tunneller = new Tunneller(random)
            tunneller.freeCells = jest.fn().mockReturnValue(2)
            const map = mockMap(world)
            mockReturnValue(map.isShapeFree, false)

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
                42, { actions: ["changeDirection"], direction: "left", generation: 1, width: 2 }
            )
            expect(positions.insert).toHaveBeenCalledWith(
                42, { position: new Vector(2, 3) }
            )
            expect(state.tunneller.actions).toEqual(["changeDirection"])
        })

        it("creates room", () => {
            const state = emptyState()
            const tunneller = new Tunneller(mockRandom())
            tunneller.createRoom = jest.fn()

            tunneller.takeAction(world, 42, state, "createRoom")

            expect(state.tunneller.actions).toEqual(["createRoom"])
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

    describe("createRoom", () => {

        let random: Random
        let tunneller: Tunneller
        let map: WorldMap
        beforeEach(() => {
            map = mockMap(world)
            random = mockRandom()
            tunneller = new Tunneller(random)
            tunneller.roomGenerator.generate = jest.fn().mockReturnValue({
                shape: new Rectangle(0, 1, 2, 3),
                entries: [{ direction: "up", shape: new Rectangle(0, 1, 2, 3) }]
            })
        })

        it("calls room creation to the left", () => {
            random.integerBetween = jest.fn().mockReturnValue(2)
            random.decision = jest.fn().mockReturnValue(true)

            tunneller.createRoom(world, stateOfDirection("up"))

            expect(tunneller.roomGenerator.generate).toHaveBeenCalledWith(new Rectangle(30, 43, 1, 2), "left")
        })

        it("calls room creation to the right", () => {
            random.integerBetween = jest.fn().mockReturnValue(2)
            random.decision = jest.fn().mockReturnValue(false)

            tunneller.createRoom(world, stateOfDirection("up"))

            expect(tunneller.roomGenerator.generate).toHaveBeenCalledWith(new Rectangle(33, 43, 1, 2), "right")
        })

        it("creates room if map is free", () => {
            random.integerBetween = jest.fn()
                .mockRejectedValueOnce(2)
                .mockRejectedValueOnce(0)
            random.decision = jest.fn().mockReturnValue(false)
            map.isShapeFree = jest.fn().mockReturnValue(true)
            tunneller.buildRoom = jest.fn()

            tunneller.createRoom(world, stateOfDirection("up"))

            expect(tunneller.buildRoom).toHaveBeenCalled()
        })

        it("does not create room if map is not free", () => {
            random.integerBetween = jest.fn().mockReturnValue(2)
            random.decision = jest.fn().mockReturnValue(false)
            map.isShapeFree = jest.fn().mockReturnValue(false)
            tunneller.createTile = jest.fn()

            tunneller.createRoom(world, stateOfDirection("up"))

            expect(tunneller.createTile).not.toHaveBeenCalled()
        })
    })

    describe("buildRoon", () => {

        let tunneller: Tunneller
        let random: Random
        beforeEach(() => {
            random = mockRandom()
            tunneller = new Tunneller(random)
            tunneller.createTile = jest.fn()
            tunneller.spawnTuneller = jest.fn()
        })

        it("creates tiles for each cell in the shape", () => {
            const map = mockMap(world)
            const state: PositionedTunneller = {
                position: { position: new Vector(1, 2) },
                tunneller: { actions: [], direction: "up", width: 2, generation: 1 }
            }
            const room: Room = { shape: new Rectangle(3, 4, 1, 1), entries: [], availableEntries: [] }

            tunneller.buildRoom(world, state, map, room)
            expect(tunneller.createTile).toHaveBeenCalledTimes(1)
            expect(tunneller.createTile).toHaveBeenCalledWith(world, map, new Vector(3, 4), "room")
        })

        it("spawns new tunnellers at available entries if they are free", () => {
            const map = mockMap(world)
            const state: PositionedTunneller = {
                position: { position: new Vector(1, 2) },
                tunneller: { actions: [], direction: "up", width: 2, generation: 1 }
            }
            const room: Room = {
                shape: new Rectangle(3, 4, 1, 1), entries: [], availableEntries: [
                    { position: new Vector(6, 7), direction: "left" }
                ]
            }

            mockReturnValues(random.integerBetween, 1, 0, 3)
            mockReturnValue(map.isShapeFree, true)

            tunneller.buildRoom(world, state, map, room)
            expect(tunneller.spawnTuneller).toHaveBeenCalledTimes(1)
            expect(tunneller.spawnTuneller).toHaveBeenCalledWith(world, new Vector(6, 7), 3, "right", 2)
        })

        it("creates tiles for each entry", () => {
            const map = mockMap(world)
            const state: PositionedTunneller = {
                position: { position: new Vector(1, 2) },
                tunneller: { actions: [], direction: "up", width: 2, generation: 1 }
            }
            const room: Room = {
                shape: new Rectangle(3, 4, 1, 1),
                entries: [new Rectangle(5, 6, 1, 1)],
                availableEntries: []
            }

            tunneller.buildRoom(world, state, map, room)
            expect(tunneller.createTile).toHaveBeenCalledTimes(2)
            expect(tunneller.createTile).toHaveBeenCalledWith(world, map, new Vector(5, 6), "corridor")
        })
    })

    describe("footprint", () => {

        const tunneller = new Tunneller(mockRandom())

        it("is just position if width is 1", () => {
            expect(tunneller.footprint(new Vector(0, 0), "up", 1)).toEqual(new Rectangle(0, 0, 1, 1))
        })

        describe("width is two", () => {

            it("starts in negative x for up and down", () => {
                expect(tunneller.footprint(new Vector(0, 0), "up", 2)).toEqual(new Rectangle(-1, 0, 2, 1))
                expect(tunneller.footprint(new Vector(0, 0), "down", 2)).toEqual(new Rectangle(-1, 0, 2, 1))
            })

            it("starts in negative y for left and right", () => {
                expect(tunneller.footprint(new Vector(0, 0), "left", 2)).toEqual(new Rectangle(0, -1, 1, 2))
                expect(tunneller.footprint(new Vector(0, 0), "right", 2)).toEqual(new Rectangle(0, -1, 1, 2))
            })
        })

        describe("width is three", () => {

            it("starts in negative x for up and down", () => {
                expect(tunneller.footprint(new Vector(0, 0), "up", 3)).toEqual(new Rectangle(-1, 0, 3, 1))
                expect(tunneller.footprint(new Vector(0, 0), "down", 3)).toEqual(new Rectangle(-1, 0, 3, 1))
            })

            it("starts in negative y for left and right", () => {
                expect(tunneller.footprint(new Vector(0, 0), "left", 3)).toEqual(new Rectangle(0, -1, 1, 3))
                expect(tunneller.footprint(new Vector(0, 0), "right", 3)).toEqual(new Rectangle(0, -1, 1, 3))
            })
        })
    })
})

function emptyState(): PositionedTunneller {
    return {
        position: { position: new Vector(32, 43) },
        tunneller: {
            actions: [],
            direction: "up",
            width: 2,
            generation: 1
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

