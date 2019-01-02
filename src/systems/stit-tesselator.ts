import { TlbWorld, ComponentName, TlbSystem } from "../tlb"
import { Rectangle } from "../geometry/rectangle"
import { Vector } from "../spatial"
import { Uniform, Exponential } from "../random/distributions"
import { Random } from "../random"

import { Entity } from "../ecs/entity"
import { SubdivisionComponent } from "../components/subdivision"
import { AgeComponent } from "../components/age"

export class StitTesselator implements TlbSystem {

    public readonly components: ComponentName[] = ["subdivision", "active", "age"]

    private exponentialRandom: Random
    private uniformRandom: Random

    public constructor(
        public uniform: Uniform, public readonly minBounds: Vector = new Vector(30, 30)
    ) {
        this.exponentialRandom = new Random(new Exponential(uniform))
        this.uniformRandom = new Random(uniform)
    }

    public update(world: TlbWorld, entity: Entity): void {
        const age = world.getComponent<AgeComponent>(entity, "age")!
        const stit = world.getComponent<SubdivisionComponent>(entity, "subdivision")!
        if (age.age === 0) {
            this.split(world, stit)
            world.editEntity(entity)
                .removeComponent("active")
                .removeComponent("age")
        } else {
            age.age--
        }
    }

    public split(world: TlbWorld, parent: SubdivisionComponent): void {
        const splitWidth = this.uniformRandom.decision(0.5)
        const canSplit = splitWidth
            ? 2 * this.minBounds.x < parent.rectangle.width
            : 2 * this.minBounds.y < parent.rectangle.height

        if (canSplit) {
            const subdivision = this.splitRectangle(splitWidth, parent.rectangle)
            const left = this.createStitCell(world, subdivision.left)
            const right = this.createStitCell(world, subdivision.right)
            parent.children = [left, right]
        }
    }

    public createStitCell(world: TlbWorld, rectangle: Rectangle): Entity {
        const age = this.exponentialRandom.integerBetween(1, rectangle.width + rectangle.height)
        return world.createEntity()
            .withComponent<SubdivisionComponent>("subdivision", { rectangle, children: [] })
            .withComponent<AgeComponent>("age", { age })
            .withComponent("active", {})
            .entity
    }

    public splitRectangle(splitWidth: boolean, rectangle: Rectangle): { left: Rectangle, right: Rectangle } {
        let left: Rectangle
        let right: Rectangle
        if (splitWidth) {
            const width0 = this.uniformRandom.integerBetween(this.minBounds.x, rectangle.width - this.minBounds.x)
            left = new Rectangle(rectangle.x, rectangle.y, width0, rectangle.height)
            right = new Rectangle(
                rectangle.x + width0, rectangle.y,
                rectangle.width - width0, rectangle.height
            )
        } else {
            const height0 = this.uniformRandom.integerBetween(this.minBounds.y, rectangle.height - this.minBounds.y)
            left = new Rectangle(rectangle.x, rectangle.y, rectangle.width, height0)
            right = new Rectangle(
                rectangle.x, rectangle.y + height0,
                rectangle.width, rectangle.height - height0
            )
        }
        return { left, right }
    }
}
