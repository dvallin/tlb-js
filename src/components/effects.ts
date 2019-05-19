import { Entity } from '../ecs/entity'

export type effect = 'damage' | 'kill' | 'stun' | 'bleed' | 'confuse' | 'defend' | 'immobilize'

export interface Effect {
  type: effect
  global: boolean
  negated: boolean

  duration?: number
  value?: number
}

export interface ActiveEffectsComponent {
  effects: {
    effect: Effect
    bodyPart: string
  }[]
}

export interface EffectComponent {
  effect: Effect
  bodyPart: string
  source: Entity
  target: Entity
}

export function damage(value: number): Effect {
  return { type: 'damage', global: false, negated: false, value }
}

export function confuse(duration: number): Effect {
  return { type: 'confuse', global: true, negated: false, duration }
}

export function stun(duration: number): Effect {
  return { type: 'stun', global: true, negated: false, duration }
}

export function immobilize(duration: number): Effect {
  return { type: 'immobilize', global: true, negated: false, duration }
}

export function kill(): Effect {
  return { type: 'kill', global: true, negated: false }
}
