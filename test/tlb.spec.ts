import { registerComponents, registerResources, registerSystems, ComponentName, ResourceName } from "../src/tlb"
import { World } from "../src/ecs/world"

describe("registerComponents", () => {

    it("registers all components", () => {
        const world = new World<ComponentName, ResourceName>()
        world.registerComponentStorage = jest.fn()

        registerComponents(world)

        expect(world.registerComponentStorage).toHaveBeenCalledTimes(11)
    })
})

describe("registerResources", () => {

    it("registers all systems", () => {
        const world = new World<ComponentName, ResourceName>()
        world.registerSystem = jest.fn()

        registerSystems(world)

        expect(world.registerSystem).toHaveBeenCalledTimes(4)
    })
})

describe("registerSystems", () => {

    it("registers all components", () => {
        const world = new World<ComponentName, ResourceName>()
        world.registerResource = jest.fn()

        registerResources(world)

        expect(world.registerResource).toHaveBeenCalledTimes(4)
    })
})
