import { Game } from "./Game"

import { Input } from "@/systems/Input"
import { ViewportSystem } from "@/rendering/Viewport"
import { MapSystem } from "@/map/Map"
import { PlayerSystem } from "@/player/Player"
import { MenuSystem } from "@/menu/Menu"
import { LightingSystem } from "@/lighting/Lighting"

const game = new Game()

game.addGameSystem(new Input((e) => game.display.eventToPosition(e)))
game.addGameSystem(new ViewportSystem())
game.addGameSystem(new MenuSystem())
game.addGameSystem(new PlayerSystem())
game.addGameSystem(new LightingSystem())
game.addGameSystem(new MapSystem())

game.build()
game.run()


