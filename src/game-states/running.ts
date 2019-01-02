import { TlbWorld } from "../tlb"
import { PositionComponent } from "../components/position"
import { Vector } from "../spatial"
import { State } from "./state"

export class Running implements State {

    public start(world: TlbWorld): void {
        world.enableSystem("free-mode-control")
        world.enableSystem("viewport-focus")
        world.createEntity()
            .withComponent<{}>("free-mode-anchor", {})
            .withComponent<{}>("viewport-focus", {})
            .withComponent<PositionComponent>("position", {
                position: new Vector(20, 20)
            })
    }

    public stop(world: TlbWorld): void {
        world.disableSystem("free-mode-control")
        world.disableSystem("viewport-focus")
    }

    public tick(world: TlbWorld): void {
        world.execute()
    }

    public isDone({ }: TlbWorld): boolean {
        return false
    }

    public isFrameLocked(): boolean {
        return true
    }
}
