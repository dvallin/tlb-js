import { Vector } from '../spatial'
import { Position } from '../renderer/position'
import { TlbWorld, ResourceName, TlbResource } from '../tlb'
import { PositionComponent } from '../components/position'
import { Input, InputResource } from './input'
import { KEYS } from 'rot-js'
import { Entity } from '../ecs/entity'

export interface Renderable {
  entity: Entity | undefined
  opaque: boolean
  centered: boolean
}

export interface Viewport {
  fromDisplay(p: Position): Vector
  collectRenderables(world: TlbWorld): Renderable[]
  toDisplay(p: Vector, centered: boolean): Position
  focus(position: Vector): void
  addLayer(layer: Layer): void
  gridLocked: boolean
  boundaries: Vector
}

export interface Layer {
  getRenderable: (world: TlbWorld, position: Vector) => Renderable
  transformed: boolean
}

export class ViewportResource implements TlbResource, Viewport {
  public readonly kind: ResourceName = 'viewport'

  public gridLocked: boolean = false
  public topLeft: Vector = new Vector(0, 0)

  public readonly layers: Layer[] = []

  public constructor(public readonly boundaries: Vector = new Vector(60, 40)) {}

  public update(world: TlbWorld): void {
    const input: Input = world.getResource<InputResource>('input')
    if (input.keyPressed.has(KEYS.VK_G)) {
      this.gridLocked = !this.gridLocked
    }

    world.components.get('viewport-focus')!.foreach(focus => {
      const position = world.getComponent<PositionComponent>(focus, 'position')!
      this.focus(position.position)
    })
  }

  public collectRenderables(world: TlbWorld): Renderable[] {
    const renderables: Renderable[] = []
    for (let y = 0; y < this.boundaries.y; y++) {
      for (let x = 0; x < this.boundaries.x; x++) {
        const p = this.fromDisplay({ x, y })
        for (let l = this.layers.length - 1; l >= 0; l--) {
          const layer = this.layers[l]
          let renderable
          if (layer.transformed) {
            renderable = layer.getRenderable(world, p)
          } else {
            renderable = layer.getRenderable(world, new Vector(x, y))
          }
          if (renderable.entity !== undefined) {
            renderables.push(renderable)
          }
          if (!renderable.opaque) {
            break
          }
        }
      }
    }
    return renderables.reverse()
  }

  public addLayer(layer: Layer) {
    this.layers.push(layer)
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
      position.x += 0.5
      position.y += 0.25
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
