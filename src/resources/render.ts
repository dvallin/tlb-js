import { TlbResource, TlbWorld, ResourceName } from "../tlb"
import { getFeature } from "../components/feature"
import { PositionComponent } from "../components/position"
import { Renderer } from "../renderer/renderer"
import { Position } from "../renderer/position"
import { Viewport } from "./viewport"

export class Render implements TlbResource {

    public readonly kind: ResourceName = "render"

    public constructor(
        private readonly renderer: Renderer
    ) { }

    public update(world: TlbWorld): void {
        this.renderer.clear()
        const viewport = world.getResource<Viewport>("viewport")
        world.getStorage("in-viewport").foreach(entity => {
            const feature = getFeature(world, entity)
            const position = world.getComponent<PositionComponent>(entity, "position")
            if (feature && position) {
                const displayPosition = viewport.toDisplay(position.position)
                this.renderer.character(feature.character, displayPosition, feature.diffuse)
            }
        })
    }

    public eventToPosition(e: UIEvent): Position | undefined {
        return this.renderer.eventToPosition(e)
    }
}
