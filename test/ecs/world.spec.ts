import { World } from "../../src/ecs/world"
import { System } from "../../src/ecs/system"
import { VectorStorage } from "../../src/ecs/storage"
import { Resource } from "../../src/ecs/resource"

type ComponentName = "component1" | "component2"
type ResourceName = "resource1" | "resource2"
type SystemName = "system1" | "system2"

describe("World", () => {

    let world: World<ComponentName, SystemName, ResourceName>
    beforeEach(() => {
        jest.resetAllMocks()
        world = new World()
    })

    describe("entity", () => {

        it("creates entities", () => {
            const entity = world.createEntity().entity
            const entity2 = world.createEntity().entity
            expect(entity).toEqual(0)
            expect(entity2).toEqual(1)
        })

        it("reuses deleted entities", () => {
            const entity = world.createEntity().entity
            world.deleteEntity(entity)
            const entity2 = world.createEntity().entity
            expect(entity).toEqual(0)
            expect(entity2).toEqual(0)
        })
    })

    describe("entities count", () => {

        it("counts entities", () => {
            const entity = world.createEntity().entity
            world.createEntity()
            expect(world.entityCount).toEqual(2)
            world.deleteEntity(entity)
            expect(world.entityCount).toEqual(1)
        })
    })

    describe("component", () => {

        it("registers components", () => {
            const storage = new VectorStorage()
            world.registerComponentStorage("component1", storage)
            expect(world.getStorage("component1")).toEqual(storage)
        })
    })

    describe("entity-component", () => {

        it("registers components for entities", () => {
            const storage = new VectorStorage()
            world.registerComponentStorage("component1", storage)
            const entity = world.createEntity()
                .withComponent("component1", {})
                .entity
            expect(storage.has(entity)).toBeTruthy()
            expect(world.hasComponent(entity, "component1")).toBeTruthy()
            expect(world.hasComponent(entity, "component2")).toBeFalsy()
        })

        it("removes components for deleted entities", () => {
            const storage = new VectorStorage()
            world.registerComponentStorage("component1", storage)
            const entity = world.createEntity()
                .withComponent("component1", {})
                .entity
            world.deleteEntity(entity)
            expect(storage.has(entity)).toBeFalsy()
            expect(world.hasComponent(entity, "component1")).toBeFalsy()
            expect(world.hasComponent(entity, "component2")).toBeFalsy()
        })

        it("fetches components of entities", () => {
            world.registerComponentStorage("component1", new VectorStorage<{}>())
            const entity = world.createEntity()
                .withComponent("component1", {})
                .entity
            expect(world.getComponent(entity, "component1")).toEqual({})
            expect(world.getComponent(entity, "component2")).toBeUndefined()
        })

        it("edits entities", () => {
            world.registerComponentStorage("component1", new VectorStorage<{ t: number }>())
            world.registerComponentStorage("component2", new VectorStorage<{ t: string }>())
            const entity = world.createEntity()
                .withComponent("component1", { t: 1 })
                .withComponent("component2", { t: "1" })
                .entity
            world.editEntity(entity)
                .removeComponent("component2")
                .withComponent("component1", { t: 2 })
            expect(world.getComponent(entity, "component1")).toEqual({ t: 2 })
            expect(world.getComponent(entity, "component2")).toBeUndefined()
        })
    })

    describe("system", () => {

        const updated = jest.fn()
        class S implements System<ComponentName, SystemName, ResourceName> {
            public readonly components: ComponentName[] = ["component1"]
            public update({ }: World<ComponentName, SystemName, ResourceName>, entity: number): void {
                updated(entity)
            }
        }

        const updated2 = jest.fn()
        class T implements System<ComponentName, SystemName, ResourceName> {
            public readonly components: ComponentName[] = ["component1", "component2"]
            public update({ }: World<ComponentName, SystemName, ResourceName>, entity: number): void {
                updated2(entity)
            }
        }

        beforeEach(() => {
            world.registerComponentStorage("component1", new VectorStorage<{}>())
            world.registerComponentStorage("component2", new VectorStorage<{}>())
        })

        it("runs enabled systems with matching entities", () => {
            world.registerSystem("system1", new S())
            world.enableSystem("system1")
            world.createEntity().withComponent("component1", {})
            world.createEntity().withComponent("component1", {})
            world.execute()
            expect(updated).toHaveBeenCalledTimes(2)
            expect(updated).toHaveBeenCalledWith(0)
            expect(updated).toHaveBeenCalledWith(1)
        })

        it("does not run system on non-matching entities", () => {
            world.registerSystem("system1", new S())
            world.enableSystem("system1")
            world.createEntity().withComponent("component1", {})
            world.createEntity().withComponent("component2", {})
            world.createEntity().withComponent("component1", {}).withComponent("component2", {})
            world.execute()
            expect(updated).toHaveBeenCalledTimes(2)
            expect(updated).toHaveBeenCalledWith(0)
            expect(updated).toHaveBeenCalledWith(2)
        })

        it("runs multiple systems", () => {
            world.registerSystem("system1", new S())
            world.registerSystem("system2", new T())
            world.enableSystem("system1")
            world.enableSystem("system2")
            world.createEntity().withComponent("component1", {})
            world.createEntity().withComponent("component2", {})
            world.createEntity().withComponent("component1", {}).withComponent("component2", {})
            world.execute()
            expect(updated).toHaveBeenCalledTimes(2)
            expect(updated).toHaveBeenCalledWith(0)
            expect(updated).toHaveBeenCalledWith(2)

            expect(updated2).toHaveBeenCalledTimes(1)
            expect(updated2).toHaveBeenCalledWith(2)
        })
    })

    describe("resources", () => {

        const updated = jest.fn()
        class R implements Resource<ComponentName, SystemName, ResourceName> {
            public readonly kind: ResourceName = "resource1"
            public update({ }: World<ComponentName, SystemName, ResourceName>): void {
                updated()
            }
        }

        it("registers resources", () => {
            const resource = new R()
            world.registerResource(resource)
            expect(world.getResource("resource1")).toEqual(resource)
            expect(world.getResource("resource2")).toBeUndefined()
        })

        it("registers resources", () => {
            world.registerResource(new R())
            world.execute()
            expect(updated).toHaveBeenCalled()
        })
    })
})
