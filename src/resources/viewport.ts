import { WorldMap } from "./world-map"
import { Vector } from "../spatial"
import { Position } from "../renderer/position"
import { TlbWorld, ResourceName, TlbResource } from "../tlb"

export class Viewport implements TlbResource {

    public readonly kind: ResourceName = "viewport"

    public topLeft: Vector = new Vector(0, 0)

    public constructor(
        public readonly boundaries: Vector = new Vector(60, 40)
    ) { }

    public update(world: TlbWorld): void {
        world.getStorage("in-viewport")!.clear()
        const map = world.getResource<WorldMap>("map")
        for (let y = 0; y < this.boundaries.y; y++) {
            for (let x = 0; x < this.boundaries.x; x++) {
                const entity = map.tiles.get(this.fromDisplay({ x, y }))
                if (entity !== undefined) {
                    world.editEntity(entity).withComponent("in-viewport", {})
                }
            }
        }
    }

    public fromDisplay(p: Position): Vector {
        return this.topLeft.add(new Vector(p.x, p.y))
    }

    public toDisplay(p: Vector): Position {
        return {
            x: p.x - this.topLeft.x,
            y: p.y - this.topLeft.y
        }
    }

    public focus(position: Vector): void {
        this.topLeft = new Vector(
            position.x - Math.floor(this.boundaries.x / 2),
            position.y - Math.floor(this.boundaries.y / 2)
        )
    }
}
