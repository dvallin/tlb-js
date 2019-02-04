import { WorldMap } from './world-map'
import { Vector } from '../spatial'
import { Position } from '../renderer/position'
import { TlbWorld, ResourceName, TlbResource } from '../tlb'
import { PositionComponent } from 'src/components/position'
import { Input } from './input'
import { VK_G } from 'rot-js'

export class Viewport implements TlbResource {
  public readonly kind: ResourceName = 'viewport'

  public gridLocked: boolean = false
  public topLeft: Vector = new Vector(0, 0)

  public constructor(public readonly boundaries: Vector = new Vector(60, 40)) {}

  public update(world: TlbWorld): void {
    const input = world.getResource<Input>('input')
    if (input.keyPressed.has(VK_G)) {
      this.gridLocked = !this.gridLocked
    }

    world.components.get('viewport-focus')!.foreach(focus => {
      const position = world.getComponent<PositionComponent>(focus, 'position')!
      this.focus(position.position)
    })

    world.getStorage('in-viewport-character')!.clear()
    world.getStorage('in-viewport-tile')!.clear()
    const map = world.getResource<WorldMap>('map')
    for (let y = 0; y < this.boundaries.y; y++) {
      for (let x = 0; x < this.boundaries.x; x++) {
        const position = this.fromDisplay({ x, y })
        const character = map.getCharacter(position.floor())
        if (character !== undefined) {
          world.editEntity(character).withComponent('in-viewport-character', {})
        }
        const tile = map.getTile(position.floor())
        if (tile !== undefined) {
          world.editEntity(tile).withComponent('in-viewport-tile', {})
        }
      }
    }
  }

  public fromDisplay(p: Position): Vector {
    return this.topLeft.add(new Vector(p.x, p.y))
  }

  public toDisplay(p: Vector, centered: boolean): Position {
    const position = { x: p.x - this.topLeft.x, y: p.y - this.topLeft.y }
    if (this.gridLocked) {
      position.x = Math.floor(position.x)
      position.y = Math.floor(position.y)
    }
    if (!this.gridLocked && centered) {
      position.x -= 0.5
      position.y -= 0.25
    }
    return position
  }

  public focus(position: Vector): void {
    const x = position.x - Math.floor(this.boundaries.x / 2)
    const y = position.y - Math.floor(this.boundaries.y / 2)
    if (this.gridLocked) {
      this.topLeft = new Vector(Math.floor(x), Math.floor(y))
    } else {
      this.topLeft = new Vector(x, y)
    }
  }
}
