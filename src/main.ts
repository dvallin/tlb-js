import { Game } from "./Game"

import { Input } from "@/systems/Input"
import { ViewportSystem } from "@/rendering/Viewport"
import { MapSystem } from "@/map/Map"
import { PlayerSystem } from "@/player/Player"
import { MenuSystem } from "@/menu/Menu"
import { LightingSystem } from "@/lighting/Lighting"
import { TriggerSystem } from "@/triggers/TriggerSystem"

const game = Game.fromSettings({})

game.addGameSystem(new Input((e) => game.display.eventToPosition(e)))
game.addGameSystem(ViewportSystem.fromSettings(game.settings))
game.addGameSystem(new MenuSystem())
game.addGameSystem(PlayerSystem.fromSettings(game.settings))
game.addGameSystem(LightingSystem.fromSettings(game.settings))
game.addGameSystem(new TriggerSystem())
game.addGameSystem(MapSystem.fromSettings(game.settings))

game.build()
game.run()


