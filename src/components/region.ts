import { Shape } from '../geometry/shape'
import { Vector } from '../spatial'
import { Entity } from '../ecs/entity'

export interface RegionComponent {
  level: number
  shape: Shape
  entry: Vector | undefined
}

export interface Connection {
  position: Vector
  other: Entity
}

export interface StructureComponent {
  kind: 'room' | 'hub' | 'corridor'
  shape: Shape
  connections: Connection[]
}
