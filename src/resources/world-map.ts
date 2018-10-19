import { DiscreteSpace, DiscreteStackedSpace, Vector } from "@/spatial"
import { Entity } from "@/ecs/entity"
import { ResourceName, TlbResource, TlbWorld } from "@/tlb"
import { FeatureComponent } from "@/components/feature"

export class WorldMap implements TlbResource {

    public readonly kind: ResourceName = "map"

    public readonly tiles: DiscreteSpace<Entity> = new DiscreteSpace<Entity>()
    public readonly items: DiscreteStackedSpace<Entity> = new DiscreteStackedSpace<Entity>()

    public constructor(
        public readonly boundary: Vector
    ) { }

    public update({ }: TlbWorld): void {
        return
    }

    public isValid(position: Vector): boolean {
        return this.boundary.bounds(position)
    }

    public isFree(world: TlbWorld, footprint: Vector[]): boolean {
        for (const position of footprint) {
            const entity = this.tiles.get(position)
            if (entity) {
                const feature = world.getComponent<FeatureComponent>(entity, "feature")
                if (feature) {
                    return false
                }
            }
        }
        return true
    }
}
