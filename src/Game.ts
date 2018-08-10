import { Display } from "rot-js"
import * as ROT from "rot-js"

import { World } from "mogwai-ecs/lib"

import { GameSystem } from "@/systems/GameSystem"
import { gray } from "@/rendering/palettes"
import { init } from "@/random";

export interface GameSettings {
    framerate: number
    screen_width: number,
    screen_height: number,

    map_width: number,
    map_height: number,

    seed: string
}

export function defaultSettings(): GameSettings {
    return {
        framerate: 30,
        screen_width: 60,
        screen_height: 40,

        // TODO: Where to get these parameters from?
        map_width: 2 * 98,
        map_height: 2 * 61,

        seed: Date.now().toString()
    }
}

export class Game {
    public static fromSettings(settings: Partial<GameSettings>): Game {
        const definiteSettings = Object.assign(defaultSettings(), settings)

        const displayOptions: ROT.DisplayOptions = {
            width: definiteSettings.screen_width,
            height: definiteSettings.screen_height,
            forceSquareRatio: true,
            fontSize: 17,
            fontFamily: "Lucida Console, Monaco, monospace",
            bg: gray[4].rgb
        }
        const display = new ROT.Display(displayOptions)
        const world = new World()

        return new Game(definiteSettings, display, world)
    }

    private systems: GameSystem[]

    constructor(
        public readonly settings: GameSettings,
        public readonly display: Display,
        public readonly world: World

    ) {
        init(settings.seed)
        this.systems = []
    }

    public addGameSystem(system: GameSystem): void {
        system.register(this.world)
        this.systems.push(system)
    }

    public build(): void {
        document.body.appendChild(this.display.getContainer())
        this.systems.forEach(system =>
            system.build(this.world)
        )
    }

    public run(): void {
        const next = Date.now() + (1000 / this.settings.framerate!)
        this.tick()
        const untilNextFrame = next - Date.now()
        setTimeout(() => this.run(), untilNextFrame)
    }

    public tick(): void {
        this.world.run()
        this.display.clear()

        const systemsByLayer: GameSystem[][] = []
        this.systems.forEach(system => {
            const layer = systemsByLayer[system.renderLayer] || []
            layer.push(system)
            systemsByLayer[system.renderLayer] = layer
        })
        systemsByLayer.forEach(layer => {
            layer.forEach(system =>
                system.render(this.world, this.display)
            )
        })
        systemsByLayer.forEach(layer => {
            layer.forEach(system =>
                system.afterRender(this.world)
            )
        })
    }
}
