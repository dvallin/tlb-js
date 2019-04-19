import { Entity } from '../ecs/entity'

export interface EffectComponent {
  damage?: number
  source: Entity
  target: Entity
}
