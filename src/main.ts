import { Game } from "./Game"

import { Input } from "@/systems/Input"
import { Map } from "@/systems/Map"

const game = new Game()

game.addGameSystem(new Input((e) => game.display.eventToPosition(e)))
game.addGameSystem(new Map())

game.build()
game.run()


