import { Vector } from '../spatial'
import { Entity } from '../ecs/entity'

export interface Action {
  type: 'move' | 'trigger' | 'action'
  position?: Vector
  entity?: Entity
}

export interface ScriptComponent {
  actions: Action[]
}
