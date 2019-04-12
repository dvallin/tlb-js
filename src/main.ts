import { Game } from './game'
import { World } from './ecs/world'
import { TlbWorld } from './tlb'
import { RotRenderer } from './renderer/renderer'

const world: TlbWorld = new World()
const renderer = RotRenderer.createAndMount(document.getElementById('tlb')!)
const game = new Game(world, renderer, 60)
game.init()
game.execute()
