import { StitTesselator } from "../../src/systems/stit-tesselator"
import { Uniform } from "../../src/random/distributions"
import { TlbWorld } from "../../src/tlb"
import { World } from "../../src/ecs/world"
import { StitCellComponent } from "../../src/components/stit-cell"
import { Rectangle } from "../../src/geometry/rectangle"
import { MapStorage } from "../../src/ecs/storage"
import { Entity } from "../../src/ecs/entity"
import { ParentComponent } from "../../src/components/parent"

describe(StitTesselator.name, () => {

    let tesseltor: StitTesselator
    let distribution: Uniform
    let world: TlbWorld
    beforeEach(() => {
        distribution = new Uniform("seed")
        distribution.sample = jest.fn().mockReturnValue(0.5)
        tesseltor = new StitTesselator(distribution)
        world = new World()
        world.registerComponentStorage<StitCellComponent>("stit-cell", new MapStorage())
        world.registerComponentStorage<{}>("active", new MapStorage())
        world.registerComponentStorage<ParentComponent>("parent", new MapStorage())
    })

    describe("age update", () => {

        it("decreases age by one", () => {
            // given
            const entity = addStit(world, new Rectangle(0, 0, 10, 10), 10)

            // when
            tesseltor.update(world, entity)

            // then
            expect(getStit(world, entity).age).toEqual(9)
        })

        it("splits if age is zero", () => {
            // given
            const entity = addStit(world, new Rectangle(0, 0, 10, 10), 0)
            const split = jest.spyOn(tesseltor, "split")

            // when
            tesseltor.update(world, entity)

            // the
            expect(split).toHaveBeenCalledWith(world, entity, getStit(world, entity))
        })

        it("deactivates if age is zero ", () => {
            // given
            const entity = addStit(world, new Rectangle(0, 0, 10, 10), 0)

            // when
            tesseltor.update(world, entity)

            // then
            expect(world.getComponent(entity, "active")).toBeUndefined()
        })
    })

    describe("split", () => {

        it("does not create children if rectangle is too small", () => {
            // given
            const entity = addStit(world, new Rectangle(0, 0, 10, 10), 0)
            const createStitCell = jest.spyOn(tesseltor, "createStitCell")

            // when
            tesseltor.update(world, entity)

            // then
            expect(createStitCell).not.toHaveBeenCalled()
        })

        it("creates children if rectangle is large enough", () => {
            // given
            const entity = addStit(world, new Rectangle(0, 0, 10, 61), 0)

            // when
            tesseltor.update(world, entity)

            // then
            expect(world.getComponent(entity + 1, "stit-cell")).toBeDefined()
            expect(world.getComponent(entity + 2, "stit-cell")).toBeDefined()
        })

        it("sets parent relation", () => {
            // given
            const entity = addStit(world, new Rectangle(0, 0, 10, 61), 0)

            // when
            tesseltor.update(world, entity)

            // then
            expect(world.getComponent(entity + 1, "parent")).toEqual({ entity })
            expect(world.getComponent(entity + 2, "parent")).toEqual({ entity })
        })

        it("creates ages for both children", () => {
            // given
            const entity = addStit(world, new Rectangle(0, 0, 10, 61), 0)
            distribution.sample = jest.fn().mockReturnValueOnce(0.5).mockReturnValueOnce(0.5)
                .mockReturnValueOnce(0.0)
                .mockReturnValueOnce(1.0)

            // when
            tesseltor.update(world, entity)

            // then
            expect(getStit(world, entity + 1).age).toEqual(1)
            expect(getStit(world, entity + 2).age).toEqual(41)
        })

        it("splits along the height of the rectangle correctly", () => {
            // given
            const entity = addStit(world, new Rectangle(0, 0, 10, 61), 0)

            // when
            tesseltor.update(world, entity)

            // then
            expect(getStit(world, entity + 1).rectangle).toEqual(new Rectangle(0, 0, 10, 31))
            expect(getStit(world, entity + 2).rectangle).toEqual(new Rectangle(0, 31, 10, 30))
        })

        it("splits along the width of the rectangle correctly", () => {
            // given
            const entity = addStit(world, new Rectangle(0, 0, 61, 10), 0)
            distribution.sample = jest.fn().mockReturnValueOnce(0.1).mockReturnValueOnce(0.5)
                .mockReturnValueOnce(0.0)
                .mockReturnValueOnce(1.0)

            // when
            tesseltor.update(world, entity)

            // then
            expect(getStit(world, entity + 1).rectangle).toEqual(new Rectangle(0, 0, 31, 10))
            expect(getStit(world, entity + 2).rectangle).toEqual(new Rectangle(31, 0, 30, 10))
        })
    })
})

function addStit(world: TlbWorld, rectangle: Rectangle, age: number): Entity {
    return world.createEntity()
        .withComponent<StitCellComponent>("stit-cell", { rectangle, age })
        .withComponent("active", {})
        .entity
}

function getStit(world: TlbWorld, entity: Entity): StitCellComponent {
    return world.getComponent<StitCellComponent>(entity, "stit-cell")!
}
