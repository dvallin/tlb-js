import { Direction } from '../spatial/direction'
import { Entity } from '../ecs/entity'

export type Action = 'render' | 'changeDirection' | 'close' | 'createRoom' | 'move'

export interface AgentComponent {
  actions: Action[]

  direction: Direction
  width: number
  generation: number

  allowedRegion?: Entity
}
