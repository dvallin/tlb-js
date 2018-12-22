import { Agent, PositionedAgent } from "../../src/systems/agent"
import { Action, AgentComponent } from "../../src/components/agent"
import { World } from "../../src/ecs/world"
import { TlbWorld } from "../../src/tlb"

import { mockRandom, mockMap, mockComponent, mockReturnValue, mockReturnValues, mockImplementation2 } from "../mocks"
import { Vector } from "../../src/spatial/vector"
import { WorldMap } from "../../src/resources/world-map"
import { Direction } from "../../src/spatial/direction"
import { Rectangle } from "../../src/geometry/rectangle"
import { Random } from "../../src/random"
import { Room } from "../../src/assets/rooms"
import { MapStorage } from "../../src/ecs/storage"
import { PositionComponent } from "../../src/components/position"
import { FeatureType } from "../../src/components/feature"
import { Shape } from "../../src/geometry/shape"

const mockCreateFeature = jest.fn()
const mockCreateDoor = jest.fn()
jest.mock("../../src/components/feature", () => ({
    createFeature: (world: TlbWorld, map: WorldMap, pos: Vector, type: FeatureType) => mockCreateFeature(world, map, pos, type),
}))
jest.mock("../../src/components/asset", () => ({
    createDoor: (world: TlbWorld, map: WorldMap, shape: Shape) => mockCreateDoor(world, map, shape),
}))

describe("Agent", () => {

    let world: TlbWorld
    beforeEach(() => {
        jest.clearAllMocks()
        world = new World()
    })

    describe("createAction", () => {

        it("renders if free", () => {
            const agent = new Agent(mockRandom())
            const map = mockMap(world)

            mockReturnValue(map.isShapeFree, true)

            expect(agent.createAction(world, emptyState())).toEqual("render")
            expect(map.isShapeFree).toHaveBeenCalledTimes(1)
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(31, 43, 2, 1))
        })

        it("closes after more moves than maximum age", () => {
            const agent = new Agent(mockRandom(), 2)
            const map = mockMap(world)
            mockReturnValue(map.isShapeFree, true)

            expect(agent.createAction(world, stateOfActions(["move", "move", "move"]))).toEqual("close")
            expect(agent.createAction(world, stateOfActions(["move", "changeDirection", "move", "move"]))).toEqual("close")
            expect(agent.createAction(world, stateOfActions(["move", "move"]))).toEqual("render")
            expect(agent.createAction(world, stateOfActions(["move", "changeDirection", "move"]))).toEqual("render")
        })

        it("changes direction if enough moves taken", () => {
            const random = mockRandom()
            const agent = new Agent(random)
            agent.freeCells = jest.fn().mockReturnValue(1)
            const map = mockMap(world)
            mockReturnValue(map.isShapeFree, false)

            expect(agent.createAction(world, stateOfActions(["move", "move", "move"]))).toEqual("changeDirection")
            expect(agent.createAction(world, stateOfActions(
                ["move", "changeDirection", "move", "move", "move"]))
            ).toEqual("changeDirection")
            expect(agent.createAction(world, stateOfActions(["move", "move"]))).not.toEqual("changeDirection")
            expect(agent.createAction(world, stateOfActions(["move", "move", "move", "changeDirection", "move"])))
                .not.toEqual("changeDirection")
        })

        it("does not change direction if enough free cells", () => {
            const random = mockRandom()
            const agent = new Agent(random)
            agent.freeCells = jest.fn().mockReturnValue(2)
            const map = mockMap(world)
            mockReturnValue(map.isShapeFree, false)

            expect(agent.createAction(world, stateOfActions(["move", "move", "move"]))).not.toEqual("changeDirection")
        })

        it("creates room if enough moves and no reason to change direction and random decision is true", () => {
            const random = mockRandom()
            const agent = new Agent(random)
            const map = mockMap(world)
            agent.freeCells = jest.fn().mockReturnValue(2)
            mockReturnValue(random.decision, true)
            mockReturnValue(map.isShapeFree, false)

            expect(agent.createAction(world, stateOfActions(["move", "move", "move"]))).toEqual("createRoom")
        })

        it("moves if next position is free", () => {
            const random = mockRandom()
            const agent = new Agent(random)
            agent.freeCells = jest.fn().mockReturnValue(2)
            const map = mockMap(world)
            mockReturnValues(map.isShapeFree, false, true)

            const nextAction = agent.createAction(world, stateOfActions(["move", "move", "move"]))
            expect(nextAction).toEqual("move")
        })

        it("closes if next position is not free", () => {
            const random = mockRandom()
            const agent = new Agent(random)
            agent.freeCells = jest.fn().mockReturnValue(2)
            const map = mockMap(world)
            mockReturnValue(map.isShapeFree, false)

            expect(agent.createAction(world, stateOfActions(["move", "move", "move"]))).toEqual("close")
        })
    })

    describe("takeAction", () => {

        it("renders", () => {
            const state = emptyState()
            const agent = new Agent(mockRandom())
            agent.render = jest.fn()

            agent.takeAction(world, 42, state, "render")

            expect(state.agent.actions).toEqual(["render"])
        })

        it("moves", () => {
            const state = emptyState()
            const agent = new Agent(mockRandom())
            const positions = mockComponent(world, "position")
            agent.move = jest.fn().mockReturnValue(new Vector(2, 3))

            agent.takeAction(world, 42, state, "move")

            expect(positions.insert).toHaveBeenCalledWith(
                42, { position: new Vector(2, 3) }
            )
            expect(state.agent.actions).toEqual(["move"])
        })

        it("changes direction", () => {
            const state = emptyState()
            const agent = new Agent(mockRandom())
            const agents = mockComponent(world, "agent")
            const positions = mockComponent(world, "position")
            agent.changeDirection = jest.fn().mockReturnValue({ direction: "left", position: new Vector(2, 3) })

            agent.takeAction(world, 42, state, "changeDirection")

            expect(agents.insert).toHaveBeenCalledWith(
                42, { actions: ["changeDirection"], direction: "left", generation: 1, width: 2 }
            )
            expect(positions.insert).toHaveBeenCalledWith(
                42, { position: new Vector(2, 3) }
            )
            expect(state.agent.actions).toEqual(["changeDirection"])
        })

        it("creates room", () => {
            const state = emptyState()
            const agent = new Agent(mockRandom())
            agent.createRoom = jest.fn()

            agent.takeAction(world, 42, state, "createRoom")

            expect(state.agent.actions).toEqual(["createRoom"])
        })

        it("closes agent", () => {
            world.deleteEntity = jest.fn()
            const state = emptyState()
            const agent = new Agent(mockRandom())

            agent.takeAction(world, 42, state, "close")

            expect(world.deleteEntity).toHaveBeenCalledWith(42)
            expect(state.agent.actions).toEqual(["close"])
        })
    })

    describe("changeDirection", () => {

        it("turns right if all is free", () => {
            const agent = new Agent(mockRandom())
            const map = mockMap(world)
            mockReturnValue(map.isShapeFree, true)

            expect(agent.changeDirection(world, stateOfDirection("up")).direction).toEqual("right")
            expect(agent.changeDirection(world, stateOfDirection("right")).direction).toEqual("down")
            expect(agent.changeDirection(world, stateOfDirection("down")).direction).toEqual("left")
            expect(agent.changeDirection(world, stateOfDirection("left")).direction).toEqual("up")
        })

        it("turns left if there is more room", () => {
            const agent = new Agent(mockRandom())
            const map = mockMap(world)
            mockImplementation2(map.isShapeFree, ({ }: TlbWorld, r: Rectangle) => {
                return r.left === 30 && r.height === 4
            })

            expect(agent.changeDirection(world, stateOfDirection("up")).direction).toEqual("left")
        })

        it("keeps going forward if there is more room", () => {
            const agent = new Agent(mockRandom())
            const map = mockMap(world)
            mockImplementation2(map.isShapeFree, ({ }: TlbWorld, r: Rectangle) => {
                return r.top === 42 && r.width === 4
            })

            expect(agent.changeDirection(world, stateOfDirection("up")).direction).toEqual("up")
        })

        it("checks correct surrounding in up direction", () => {
            const agent = new Agent(mockRandom())
            const map = mockMap(world)
            mockReturnValue(map.isShapeFree, false)
            agent.changeDirection(world, stateOfDirection("up"))
            expect(map.isShapeFree).toHaveBeenCalledTimes(3)
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(33, 42, 1, 4))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(30, 42, 1, 4))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(30, 42, 4, 1))
        })

        it("checks correct surrounding in down direction", () => {
            const agent = new Agent(mockRandom())
            const map = mockMap(world)
            mockReturnValue(map.isShapeFree, false)
            agent.changeDirection(world, stateOfDirection("down"))
            expect(map.isShapeFree).toHaveBeenCalledTimes(3)
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(30, 41, 1, 4))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(33, 41, 1, 4))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(30, 44, 4, 1))
        })

        it("checks correct surrounding in right direction", () => {
            const agent = new Agent(mockRandom())
            const map = mockMap(world)
            mockReturnValue(map.isShapeFree, false)
            agent.changeDirection(world, stateOfDirection("right"))
            expect(map.isShapeFree).toHaveBeenCalledTimes(3)
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(33, 41, 1, 4))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(30, 41, 4, 1))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(30, 44, 4, 1))
        })

        it("checks correct surrounding in left direction", () => {
            const agent = new Agent(mockRandom())
            const map = mockMap(world)
            mockReturnValue(map.isShapeFree, false)
            agent.changeDirection(world, stateOfDirection("left"))
            expect(map.isShapeFree).toHaveBeenCalledTimes(3)
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(31, 41, 1, 4))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(31, 44, 4, 1))
            expect(map.isShapeFree).toHaveBeenCalledWith(world, new Rectangle(31, 41, 4, 1))
        })
    })

    describe("createRoom", () => {

        let random: Random
        let agent: Agent
        let map: WorldMap
        beforeEach(() => {
            map = mockMap(world)
            random = mockRandom()
            agent = new Agent(random)
            agent.roomGenerator.generate = jest.fn().mockReturnValue({
                shape: new Rectangle(0, 1, 2, 3),
                entries: [{ direction: "up", shape: new Rectangle(0, 1, 2, 3) }]
            })
        })

        it("calls room creation to the left", () => {
            random.integerBetween = jest.fn().mockReturnValue(2)
            random.decision = jest.fn().mockReturnValue(true)

            agent.createRoom(world, stateOfDirection("up"))

            expect(agent.roomGenerator.generate).toHaveBeenCalledWith(new Rectangle(30, 43, 1, 2), "left")
        })

        it("calls room creation to the right", () => {
            random.integerBetween = jest.fn().mockReturnValue(2)
            random.decision = jest.fn().mockReturnValue(false)

            agent.createRoom(world, stateOfDirection("up"))

            expect(agent.roomGenerator.generate).toHaveBeenCalledWith(new Rectangle(33, 43, 1, 2), "right")
        })

        it("creates room if map is free", () => {
            random.integerBetween = jest.fn()
                .mockRejectedValueOnce(2)
                .mockRejectedValueOnce(0)
            random.decision = jest.fn().mockReturnValue(false)
            map.isShapeFree = jest.fn().mockReturnValue(true)
            agent.buildRoom = jest.fn()

            agent.createRoom(world, stateOfDirection("up"))

            expect(agent.buildRoom).toHaveBeenCalled()
        })

        it("does not create room if map is not free", () => {
            random.integerBetween = jest.fn().mockReturnValue(2)
            random.decision = jest.fn().mockReturnValue(false)
            map.isShapeFree = jest.fn().mockReturnValue(false)
            agent.buildRoom = jest.fn()

            agent.createRoom(world, stateOfDirection("up"))

            expect(agent.buildRoom).not.toHaveBeenCalled()
        })
    })

    describe("buildRoon", () => {

        let agent: Agent
        let random: Random
        beforeEach(() => {
            random = mockRandom()
            agent = new Agent(random)
            agent.spawnAgent = jest.fn()
        })

        it("creates tiles for each cell in the shape", () => {
            const map = mockMap(world)
            const state: PositionedAgent = {
                position: { position: new Vector(1, 2) },
                agent: { actions: [], direction: "up", width: 2, generation: 1 }
            }
            const room: Room = {
                shape: new Rectangle(3, 4, 1, 1),
                entries: [],
                assets: [],
                availableEntries: [],
                availableAssets: []
            }

            agent.buildRoom(world, state, map, room)

            expect(mockCreateFeature).toHaveBeenCalledTimes(1)
            expect(mockCreateFeature).toHaveBeenCalledWith(world, map, new Vector(3, 4), "room")
        })

        it("spawns new agents at available entries", () => {
            const map = mockMap(world)
            const state: PositionedAgent = {
                position: { position: new Vector(1, 2) },
                agent: { actions: [], direction: "up", width: 2, generation: 1 }
            }
            const room: Room = {
                shape: new Rectangle(3, 4, 1, 1),
                entries: [],
                assets: [],
                availableEntries: [
                    { position: new Vector(6, 7), direction: "left" }
                ],
                availableAssets: []
            }

            mockReturnValues(random.integerBetween, 1, 0, 3)
            mockReturnValue(map.isShapeFree, true)

            agent.buildRoom(world, state, map, room)

            expect(agent.spawnAgent).toHaveBeenCalledTimes(1)
            expect(agent.spawnAgent).toHaveBeenCalledWith(world, new Vector(6, 7), 3, "right", 2)
        })

        it("does not spawn new agents if generation is too high", () => {
            const map = mockMap(world)
            const state: PositionedAgent = {
                position: { position: new Vector(1, 2) },
                agent: { actions: [], direction: "up", width: 2, generation: 10 }
            }
            const room: Room = {
                shape: new Rectangle(3, 4, 1, 1),
                entries: [],
                assets: [],
                availableEntries: [
                    { position: new Vector(6, 7), direction: "left" }
                ],
                availableAssets: []
            }

            mockReturnValues(random.integerBetween, 1, 0, 3)
            mockReturnValue(map.isShapeFree, true)

            agent.buildRoom(world, state, map, room)

            expect(agent.spawnAgent).toHaveBeenCalledTimes(0)
        })

        it("does not spawn new agents at entries that are not free", () => {
            const map = mockMap(world)
            const state: PositionedAgent = {
                position: { position: new Vector(1, 2) },
                agent: { actions: [], direction: "up", width: 2, generation: 1 }
            }
            const room: Room = {
                shape: new Rectangle(3, 4, 1, 1),
                entries: [],
                assets: [],
                availableEntries: [
                    { position: new Vector(6, 7), direction: "left" }
                ],
                availableAssets: []
            }

            mockReturnValues(random.integerBetween, 1, 0, 3)
            mockReturnValue(map.isShapeFree, false)

            agent.buildRoom(world, state, map, room)

            expect(agent.spawnAgent).toHaveBeenCalledTimes(0)
        })

        it("creates tiles for each entry", () => {
            const map = mockMap(world)
            const state: PositionedAgent = {
                position: { position: new Vector(1, 2) },
                agent: { actions: [], direction: "up", width: 2, generation: 1 }
            }
            const room: Room = {
                shape: new Rectangle(3, 4, 1, 1),
                entries: [new Rectangle(5, 6, 1, 1)],
                assets: [],
                availableEntries: [],
                availableAssets: []
            }

            agent.buildRoom(world, state, map, room)
            expect(mockCreateFeature).toHaveBeenCalledTimes(2)
            expect(mockCreateFeature).toHaveBeenCalledWith(world, map, new Vector(5, 6), "corridor")
        })
    })

    describe("footprint", () => {

        const agent = new Agent(mockRandom())

        it("is just position if width is 1", () => {
            expect(agent.footprint(new Vector(0, 0), "up", 1)).toEqual(new Rectangle(0, 0, 1, 1))
        })

        describe("width is two", () => {

            it("starts in negative x for up and down", () => {
                expect(agent.footprint(new Vector(0, 0), "up", 2)).toEqual(new Rectangle(-1, 0, 2, 1))
                expect(agent.footprint(new Vector(0, 0), "down", 2)).toEqual(new Rectangle(-1, 0, 2, 1))
            })

            it("starts in negative y for left and right", () => {
                expect(agent.footprint(new Vector(0, 0), "left", 2)).toEqual(new Rectangle(0, -1, 1, 2))
                expect(agent.footprint(new Vector(0, 0), "right", 2)).toEqual(new Rectangle(0, -1, 1, 2))
            })
        })

        describe("width is three", () => {

            it("starts in negative x for up and down", () => {
                expect(agent.footprint(new Vector(0, 0), "up", 3)).toEqual(new Rectangle(-1, 0, 3, 1))
                expect(agent.footprint(new Vector(0, 0), "down", 3)).toEqual(new Rectangle(-1, 0, 3, 1))
            })

            it("starts in negative y for left and right", () => {
                expect(agent.footprint(new Vector(0, 0), "left", 3)).toEqual(new Rectangle(0, -1, 1, 3))
                expect(agent.footprint(new Vector(0, 0), "right", 3)).toEqual(new Rectangle(0, -1, 1, 3))
            })
        })
    })

    describe("spawn agent", () => {

        it("spawns", () => {
            world.registerComponentStorage("agent", new MapStorage<AgentComponent>())
            world.registerComponentStorage("position", new MapStorage<PositionComponent>())
            const agent = new Agent(mockRandom())
            agent.spawnAgent(world, new Vector(1, 2), 3, "left", 4)
            expect(world.getComponent(0, "agent")).toEqual({ actions: [], direction: "left", width: 3, generation: 4 })
            expect(world.getComponent(0, "position")).toEqual({ position: new Vector(1, 2) })
        })
    })
})

function emptyState(): PositionedAgent {
    return {
        position: { position: new Vector(32, 43) },
        agent: {
            actions: [],
            direction: "up",
            width: 2,
            generation: 1
        }
    }
}

function stateOfDirection(direction: Direction): PositionedAgent {
    const state = emptyState()
    state.agent.direction = direction
    return state
}

function stateOfActions(actions: Action[]): PositionedAgent {
    const state = emptyState()
    state.agent.actions = actions
    return state
}

