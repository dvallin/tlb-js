import { Vector } from '../spatial'
import { Renderer } from '../renderer/renderer'
import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'

export interface UIElement {
  element: Entity
  render(renderer: Renderer): void
  update(world: TlbWorld): void
  contains(position: Vector): boolean
}
