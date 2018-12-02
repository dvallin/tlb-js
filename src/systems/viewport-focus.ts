import { ComponentName, TlbSystem, ResourceName } from "../tlb"
import { World } from "../ecs/world"
import { PositionComponent } from "../components/position"
import { Viewport } from "../resources/viewport"

export class ViewportFocus implements TlbSystem {

    public readonly components: ComponentName[] = ["viewport-focus", "position"]

    public update(world: World<ComponentName, ResourceName>, entity: number): void {
        const position = world.getComponent<PositionComponent>(entity, "position")!
        const viewport = world.getResource<Viewport>("viewport")!
        viewport.focus(position.position)
    }
}
