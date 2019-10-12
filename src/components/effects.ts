import { Entity } from '../ecs/entity'
import { bodyPartType } from './character-stats'

export type effect = 'damage' | 'kill' | 'stun' | 'bleed' | 'confuse' | 'defend' | 'immobilize'

export interface Effect {
  type: effect
  global: boolean
  negated: boolean

  restricted?: bodyPartType[]
  duration?: number
  value?: number
}

export interface ActiveEffectsComponent {
  effects: {
    effect: Effect
    bodyPart?: string
  }[]
}

export interface EffectComponent {
  effect: Effect
  source: Entity
  target: Entity
  bodyParts?: string[]
}

export function damage(value: number, restricted: bodyPartType[] = ['torso']): Effect {
  return { type: 'damage', global: false, negated: false, value, restricted }
}

export function confuse(duration: number): Effect {
  return { type: 'confuse', global: true, negated: false, duration }
}

export function defend(value: number, duration: number): Effect {
  return { type: 'defend', global: true, negated: false, duration, value }
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
