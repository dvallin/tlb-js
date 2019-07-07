import { World } from './world'
import { Entity } from './entity'

export interface System<C, S, R> {
  readonly components: C[]
  update(world: World<C, S, R>, entity: Entity): void
}
