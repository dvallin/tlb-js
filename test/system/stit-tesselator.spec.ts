import { StitTesselator } from "../../src/systems/stit-tesselator"
import { Uniform } from "../../src/random/distributions"
import { TlbWorld } from "../../src/tlb"
import { World } from "../../src/ecs/world"
import { AgeComponent } from "../../src/components/age"
import { SubdivisionComponent } from "../../src/components/subdivision"
import { Rectangle } from "../../src/geometry/rectangle"
import { MapStorage } from "../../src/ecs/storage"
import { Entity } from "../../src/ecs/entity"
import { AgentComponent } from "../../src/components/agent"

describe(StitTesselator.name, () => {

    let tesseltor: StitTesselator
    let distribution: Uniform
    let world: TlbWorld
    beforeEach(() => {
        distribution = new Uniform("seed")
        distribution.sample = jest.fn().mockReturnValue(0.5)
        tesseltor = new StitTesselator(distribution)
        world = new World()
        world.registerComponentStorage<SubdivisionComponent>("subdivision", new MapStorage())
        world.registerComponentStorage<AgentComponent>("age", new MapStorage())
        world.registerComponentStorage<{}>("active", new MapStorage())
    })

    describe("age update", () => {

        it("decreases age by one", () => {
            // given
            const entity = addStit(world, new Rectangle(0, 0, 10, 10), 10)

            // when
            tesseltor.update(world, entity)

            // then
            expect(getAge(world, entity).age).toEqual(9)
        })

        it("splits if age is zero", () => {
            // given
            const entity = addStit(world, new Rectangle(0, 0, 10, 10), 0)
            const split = jest.spyOn(tesseltor, "split")

            // when
            tesseltor.update(world, entity)

            // the
            expect(split).toHaveBeenCalledWith(world, getSubdivision(world, entity))
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
            expect(getSubdivision(world, entity).children).toEqual([entity + 1, entity + 2])
            expect(getSubdivision(world, entity + 1)).toBeDefined()
            expect(getSubdivision(world, entity + 2)).toBeDefined()
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
            expect(getAge(world, entity + 1).age).toEqual(1)
            expect(getAge(world, entity + 2).age).toEqual(41)
        })

        it("splits along the height of the rectangle correctly", () => {
            // given
            const entity = addStit(world, new Rectangle(0, 0, 10, 61), 0)

            // when
            tesseltor.update(world, entity)

            // then
            expect(getSubdivision(world, entity + 1).rectangle).toEqual(new Rectangle(0, 0, 10, 31))
            expect(getSubdivision(world, entity + 2).rectangle).toEqual(new Rectangle(0, 31, 10, 30))
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
            expect(getSubdivision(world, entity + 1).rectangle).toEqual(new Rectangle(0, 0, 31, 10))
            expect(getSubdivision(world, entity + 2).rectangle).toEqual(new Rectangle(31, 0, 30, 10))
        })
    })
})

function addStit(world: TlbWorld, rectangle: Rectangle, age: number): Entity {
    return world.createEntity()
        .withComponent<SubdivisionComponent>("subdivision", { rectangle, children: [] })
        .withComponent<AgeComponent>("age", { age })
        .withComponent("active", {})
        .entity
}

function getSubdivision(world: TlbWorld, entity: Entity): SubdivisionComponent {
    return world.getComponent<SubdivisionComponent>(entity, "subdivision")!
}

function getAge(world: TlbWorld, entity: Entity): AgeComponent {
    return world.getComponent<AgeComponent>(entity, "age")!
}
