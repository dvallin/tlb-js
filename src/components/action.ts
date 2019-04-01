import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'

export interface Action {
  type: 'move'
  target: Entity
  position: Vector
}

export interface ScriptComponent {
  actions: Action[]
}

export interface SelectedActionComponent {
  type?: 'move' | 'use' | 'end-turn'
  target?: Entity
  position?: Vector
  using?: Entity
}

export interface DamageComponent {
  damage: number
  source: Entity
  target: Entity
}
