import { DiscreteSpace, DiscreteStackedSpace, Vector, Space, StackedSpace } from "../spatial"
import { Entity } from "../ecs/entity"
import { ResourceName, TlbResource, TlbWorld } from "../tlb"
import { FeatureComponent } from "../components/feature"
import { Shape } from "src/geometry/shape";

export class WorldMap implements TlbResource {

    public readonly kind: ResourceName = "map"

    public readonly tiles: Space<Entity> = new DiscreteSpace<Entity>()
    public readonly items: StackedSpace<Entity> = new DiscreteStackedSpace<Entity>()

    public constructor(
        public readonly boundary: Vector
    ) { }

    public update({ }: TlbWorld): void {
        return
    }

    public isValid(position: Vector): boolean {
        return this.boundary.bounds(position)
    }

    public isFree(world: TlbWorld, position: Vector): boolean {
        const entity = this.tiles.get(position)
        if (entity) {
            const feature = world.getComponent<FeatureComponent>(entity, "feature")
            if (feature) {
                return false
            }
        }
        return true
    }

    public isShapeFree(world: TlbWorld, shape: Shape): boolean {
        return shape.takeWhile(p => this.isFree(world, p))
    }
}
