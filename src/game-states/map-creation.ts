import { TlbWorld } from "../tlb"
import { AgentComponent } from "../components/agent"
import { PositionComponent } from "../components/position"
import { Vector } from "../spatial"
import { State } from "./state"

export class MapCreation implements State {

    public start(world: TlbWorld): void {
        world.enableSystem("agent")
        world.createEntity()
            .withComponent<AgentComponent>("agent", {
                actions: [],
                direction: "down",
                width: 3,
                generation: 1
            })
            .withComponent<PositionComponent>("position", {
                position: new Vector(20, 20)
            })
    }

    public stop(world: TlbWorld): void {
        world.disableSystem("agent")
    }

    public tick(world: TlbWorld): void {
        world.execute()
    }

    public isDone(world: TlbWorld): boolean {
        return world.emptySystems.has("agent")
    }

    public isFrameLocked(): boolean {
        return false
    }
}
