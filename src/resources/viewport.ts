import { Vector } from '../spatial'
import { Position } from '../renderer/position'
import { TlbWorld, ResourceName, TlbResource } from '../tlb'
import { PositionComponent } from '../components/position'
import { Input, InputResource } from './input'
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
  focus(level: number, position: Vector): void
  addLayer(layer: Layer): void
  gridLocked: boolean
  boundaries: Vector

  level: number
}

export interface Layer {
  getRenderable: (world: TlbWorld, layer: number, position: Vector) => Renderable
  transformed: boolean
}

export class ViewportResource implements TlbResource, Viewport {
  public readonly kind: ResourceName = 'viewport'

  public gridLocked: boolean = false
  public topLeft: Vector = new Vector([0, 0])
  public level: number = 0

  public readonly layers: Layer[] = []

  public constructor(public readonly boundaries: Vector) {}

  public update(world: TlbWorld): void {
    const input: Input = world.getResource<InputResource>('input')
    if (input.isActive('grid')) {
      this.gridLocked = !this.gridLocked
    }

    world.components.get('viewport-focus')!.foreach(focus => {
      const position = world.getComponent<PositionComponent>(focus, 'position')
      if (position !== undefined) {
        this.focus(position.level, position.position)
      }
    })
  }

  public collectRenderables(world: TlbWorld): Renderable[] {
    const renderables: Renderable[] = []
    for (let y = 0; y < this.boundaries.y; y++) {
      for (let x = 0; x < this.boundaries.x; x++) {
        for (let l = this.layers.length - 1; l >= 0; l--) {
          const layer = this.layers[l]
          let renderable
          if (layer.transformed) {
            renderable = layer.getRenderable(world, this.level, this.fromDisplay({ x, y }))
          } else {
            renderable = layer.getRenderable(world, this.level, new Vector([x, y]))
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
    return new Vector([this.topLeft.x + p.x, this.topLeft.y + p.y])
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

  public focus(level: number, position: Vector): void {
    this.level = level

    const x = position.x - Math.floor(this.boundaries.x / 2) + 5
    const y = position.y - Math.floor(this.boundaries.y / 2) + 5
    if (this.gridLocked) {
      this.topLeft = new Vector([Math.floor(x), Math.floor(y)])
    } else {
      this.topLeft = new Vector([x, y])
    }
  }
}
