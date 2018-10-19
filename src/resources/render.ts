import { TlbResource, TlbWorld, ResourceName } from "@/tlb"
import { getFeature } from "@/components/feature"
import { PositionComponent } from "@/components/position"
import { Renderer } from "@/renderer/renderer"

export class Render implements TlbResource {

    public readonly kind: ResourceName = "render"

    public constructor(
        private readonly renderer: Renderer
    ) { }

    public update(world: TlbWorld): void {
        this.renderer.clear()
        world.getStorage("in-viewport").foreach(entity => {
            const feature = getFeature(world, entity)
            const position = world.getComponent<PositionComponent>(entity, "position")
            if (feature && position) {
                this.renderer.character(feature.character, position.position, feature.diffuse)
            }
        })
    }
}
