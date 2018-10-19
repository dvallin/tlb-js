import { WorldMap } from "@/resources/world-map"
import { Vector } from "@/spatial"
import { TlbResource, TlbWorld, ResourceName } from "@/tlb"

export class Viewport implements TlbResource {

    public readonly kind: ResourceName = "viewport"

    public update(world: TlbWorld): void {
        world.getStorage("in-viewport")!.clear()
        const map = world.getResource<WorldMap>("map")
        for (let y = 0; y < 40; y++) {
            for (let x = 0; x < 60; x++) {
                const entity = map.tiles.get(new Vector(x, y))
                if (entity !== undefined) {
                    world.editEntity(entity).withComponent("in-viewport", {})
                }
            }
        }
    }
}
