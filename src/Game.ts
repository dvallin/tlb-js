import { World } from "@/ecs/world"
import { TlbWorld, registerComponents, registerSystems, registerResources } from "@/tlb"
import { TunnellerComponent } from "@/components/tunneller"
import { PositionComponent } from "@/components/position"
import { Vector } from "@/spatial"

export class Game {

    private compute: number = 0
    private started: number = 0
    private frames: number = 0

    public constructor(
        private readonly world: TlbWorld = new World()
    ) { }

    public execute(): void {
        this.init()
        this.world.createEntity()
            .withComponent<TunnellerComponent>("tunneller", {
                actions: [],
                direction: "down",
                width: 3
            })
            .withComponent<PositionComponent>("position", {
                position: new Vector(20, 20)
            })
        this.started = Date.now()
        this.tick()
    }

    private tick(): void {
        this.frames++

        const start = Date.now()
        this.world.execute()
        const delta = Date.now() - start
        this.compute += delta

        if (this.frames % 100 === 0) {
            const fps = this.frames / ((Date.now() - this.started) / 1000)
            const mspf = this.compute / this.frames
            console.log(`${mspf.toFixed(2)} ms per frame @${fps.toFixed(1)} FPS`)
        }

        setTimeout(() => this.tick(), (1000 / 30) - delta)
    }

    private init(): void {
        registerComponents(this.world)
        registerResources(this.world)
        registerSystems(this.world)
    }
}
