import { Entity } from '../ecs/entity'

export type status = 'stunned' | 'confused'
export type effect = 'damage' | 'heal' | 'stun' | 'confuse'

export interface StatusEffect {
  duration: number
  status: status
}

export interface StatusEffectComponent {
  activeEffects: StatusEffect[]
}

export interface EffectComponent {
  effect: effect
  value?: number
  duration?: number
  source: Entity
  target: Entity
}
