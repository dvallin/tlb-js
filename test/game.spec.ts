import { Game } from "../src/game"
import { World } from "../src/ecs/world"
import { ComponentName, ResourceName } from "../src/tlb"

import { TunnellerComponent } from "../src/components/tunneller"

describe("Game", () => {

    let game: Game
    let world: World<ComponentName, ResourceName>
    beforeEach(() => {
        jest.useFakeTimers()
        world = new World()
        game = new Game(world)
    })

    it("counts frames and sets timing values", () => {
        game.execute()
        expect(game.frames).toEqual(1)
        expect(game.compute).toBeGreaterThan(0)
        expect(game.started).toBeGreaterThan(0)
        expect(game.fps).toBeGreaterThan(0)
        expect(game.mspf).toBeGreaterThan(0)

        jest.runOnlyPendingTimers()

        expect(game.frames).toEqual(2)
        expect(game.compute).toBeGreaterThan(0)
        expect(game.started).toBeGreaterThan(0)
        expect(game.fps).toBeGreaterThan(0)
        expect(game.mspf).toBeGreaterThan(0)
    })

    it("creates a tunneller", () => {
        game.execute()

        expect(world.getComponent(0, "tunneller")).toBeDefined()
        expect(world.getComponent(0, "position")).toBeDefined()
    })

    it("already updated the tunneller", () => {
        game.execute()

        expect(world.getComponent<TunnellerComponent>(0, "tunneller")!.actions).toEqual(["render"])
    })
})
