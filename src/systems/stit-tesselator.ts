import { TlbWorld, ComponentName, TlbSystem } from "../tlb"
import { Rectangle } from "../geometry/rectangle"
import { Vector } from "../spatial"
import { Uniform, Exponential } from "../random/distributions"
import { Random } from "../random"

import { Entity } from "../ecs/entity"
import { StitCellComponent } from "../components/stit-cell"
import { ParentComponent } from "../components/parent"

export class StitTesselator implements TlbSystem {

    public readonly components: ComponentName[] = ["stit-cell", "active"]

    private exponentialRandom: Random
    private uniformRandom: Random

    public constructor(
        public uniform: Uniform, public readonly minBounds: Vector = new Vector(30, 30)
    ) {
        this.exponentialRandom = new Random(new Exponential(uniform))
        this.uniformRandom = new Random(uniform)
    }

    public update(world: TlbWorld, entity: Entity): void {
        const stit = world.getComponent<StitCellComponent>(entity, "stit-cell")!
        if (stit.age === 0) {
            this.split(world, entity, stit)
            world.editEntity(entity).removeComponent("active")
        } else {
            stit.age--
        }
    }

    public split(world: TlbWorld, entity: Entity, stit: StitCellComponent) {
        const splitWidth = this.uniformRandom.decision(0.5)
        const canSplit = splitWidth
            ? 2 * this.minBounds.x < stit.rectangle.width
            : 2 * this.minBounds.y < stit.rectangle.height

        if (canSplit) {
            const subdivision = this.splitRectangle(splitWidth, stit.rectangle)
            this.createStitCell(world, entity, subdivision.left)
            this.createStitCell(world, entity, subdivision.right)
        }
    }

    public createStitCell(world: TlbWorld, entity: Entity, rectangle: Rectangle): void {
        const age = this.exponentialRandom.integerBetween(1, rectangle.width + rectangle.height)
        world.createEntity()
            .withComponent<StitCellComponent>("stit-cell", { rectangle, age })
            .withComponent<ParentComponent>("parent", { entity })
            .withComponent("active", {})
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
