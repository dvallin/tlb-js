import { Shape } from '../geometry/shape'
import { Vector } from '../spatial'
import { Entity } from '../ecs/entity'

export type RegionsType = 'red'

export interface RegionComponent {
  type: RegionsType
  level: number
  shape: Shape
  entry: Vector | undefined
  authorized: Set<Entity>
}

export type StructureType = 'room' | 'hub' | 'corridor'

export interface StructureComponent {
  region: Entity
  kind: StructureType
  shape: Shape
  connections: Entity[]
}
