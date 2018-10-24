import { ComponentName, TlbSystem, ResourceName } from "../tlb"
import { World } from "../ecs/world"
import { PositionComponent } from "../components/position"
import { Input } from "../resources/input"
import { VK_H, VK_J, VK_K, VK_L } from "rot-js"
import { Vector } from "../spatial"

export class FreeModeControl implements TlbSystem {

    public readonly components: ComponentName[] = ["free-mode-anchor", "position"]

    public update(world: World<ComponentName, ResourceName>, entity: number): void {
        const position = world.getComponent<PositionComponent>(entity, "position")
        const input = world.getResource<Input>("input")
        if (position && input) {
            let delta = new Vector(0, 0)
            if (input.keyDown.has(VK_H)) {
                delta = delta.add(Vector.fromDirection("left"))
            }
            if (input.keyDown.has(VK_J)) {
                delta = delta.add(Vector.fromDirection("down"))
            }
            if (input.keyDown.has(VK_K)) {
                delta = delta.add(Vector.fromDirection("up"))
            }
            if (input.keyDown.has(VK_L)) {
                delta = delta.add(Vector.fromDirection("right"))
            }
            if (delta.squaredLength() > 0) {
                const newPosition = position.position.add(delta.normalize())
                world.editEntity(entity).withComponent("position", { position: newPosition })
            }
        }
    }
}
