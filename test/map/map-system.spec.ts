import { MapSystem } from "../../src/map/Map"
import { PlayerSystem } from "../../src/player/Player"
import { LightingSystem } from "../../src/lighting/Lighting"
import { ViewportSystem } from "../../src/rendering/Viewport"
import { World } from "mogwai-ecs"
import { Game } from "../../src/Game"
import { lightDisplay, tileDisplay } from "../testing/display-mocks"
import { Display } from "rot-js"

describe("MapSystem", () => {

    it("renders tiles", () => {
        const img = []

        renderOneTick(tileDisplay(img), true)

        expect(render(img, 60, 30)).toMatchSnapshot()
    })

    it("renders only discovered tiles", () => {
        const img = []

        renderOneTick(tileDisplay(img), false)

        expect(render(img, 60, 30)).toMatchSnapshot()
    })

    it("renders lighting", () => {
        const light = []

        renderOneTick(lightDisplay(light), true)

        expect(render(light, 60, 30)).toMatchSnapshot()
    })
})

function renderOneTick(display: Display, allVisible: boolean): void {
    const world = new World()
    const game = new Game({
        screen_width: 60, screen_height: 30,
        map_width: 60, map_height: 30,
        framerate: 30,
        seed: "default-seed"
    }, display, world)
    game.addGameSystem(ViewportSystem.fromSettings(game.settings))
    game.addGameSystem(PlayerSystem.fromSettings(game.settings))
    const lighting = LightingSystem.fromSettings(game.settings)
    if (allVisible) {
        lighting.isDiscovered = () => (true)
        lighting.isVisible = () => (true)
    }
    game.addGameSystem(lighting)
    game.addGameSystem(MapSystem.fromSettings(game.settings))

    game.build()
    game.tick()
}

function render(img: string[][], width: number, height: number): string {
    let result = ""
    for (let y = 0; y < height; ++y) {
        const line = img[y] || []
        for (let x = 0; x < width; ++x) {
            result += line[x] || " "
        }
        result += "\n"
    }
    return result
}
