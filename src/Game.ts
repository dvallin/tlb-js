import { World } from "./ecs/world"
import { TlbWorld, registerComponents, registerSystems, registerResources } from "./tlb"
import { TunnellerComponent } from "./components/tunneller"
import { PositionComponent } from "./components/position"
import { Vector } from "./spatial"

export class Game {

    public compute: number = 0
    public started: number = 0
    public frames: number = 0

    public constructor(
        private readonly world: TlbWorld = new World()
    ) { }

    public execute(): void {
        this.init()
        this.world.createEntity()
            .withComponent<TunnellerComponent>("tunneller", {
                actions: [],
                direction: "down",
                width: 3,
                generation: 1
            })
            .withComponent<PositionComponent>("position", {
                position: new Vector(20, 20)
            })

        this.world.createEntity()
            .withComponent<{}>("free-mode-anchor", {})
            .withComponent<{}>("viewport-focus", {})
            .withComponent<PositionComponent>("position", {
                position: new Vector(20, 20)
            })
        this.tick()
        this.started = Date.now()
    }

    private tick(): void {

        const start = Date.now()
        this.world.execute()
        const delta = Date.now() - start
        this.compute += delta

        this.frames++
        if (this.frames % 100 === 0) {
            console.log(`${this.mspf.toFixed(2)} ms per frame @${this.fps.toFixed(1)} FPS entities: ${this.world.entityCount}`)
            this.frames = 0
            this.compute = 0
            this.started = Date.now()
        }

        setTimeout(() => this.tick(), (1000 / 30) - delta)
    }

    public get fps(): number {
        return this.frames / ((Date.now() - this.started) / 1000)
    }

    public get mspf(): number {
        return this.compute / this.frames
    }

    private init(): void {
        registerComponents(this.world)
        registerResources(this.world)
        registerSystems(this.world)
    }
}
