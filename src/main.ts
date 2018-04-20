import { Game } from "./Game"

import { Input } from "@/systems/Input"
import { ViewportSystem } from "@/systems/Viewport"
import { Map } from "@/map/Map"
import { Player } from "@/player/Player"
import { Menu } from "@/systems/Menu"

const game = new Game()

game.addGameSystem(new Input((e) => game.display.eventToPosition(e)))
game.addGameSystem(new ViewportSystem())
game.addGameSystem(new Menu())
game.addGameSystem(new Player())
game.addGameSystem(new Map())

game.build()
game.run()


