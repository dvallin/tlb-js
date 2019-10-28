import { Entity } from '../ecs/entity'
import { bodyPartType } from './character-stats'

export type effect = 'damage' | 'kill' | 'stun' | 'bleed' | 'confuse' | 'defend' | 'immobilize' | 'negate' | 'heal'

export interface Effect {
  type: effect
  global: boolean
  negative: boolean

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
  return { type: 'damage', global: false, negative: true, value, restricted }
}

export function confuse(duration: number): Effect {
  return { type: 'confuse', global: true, negative: true, duration }
}

export function defend(value: number, duration: number, global: boolean = true): Effect {
  return { type: 'defend', global, negative: false, duration, value }
}

export function stun(duration: number): Effect {
  return { type: 'stun', global: true, negative: true, duration }
}

export function immobilize(duration: number): Effect {
  return { type: 'immobilize', global: true, negative: true, duration }
}

export function bleed(): Effect {
  return { type: 'bleed', global: true, negative: true }
}

export function kill(): Effect {
  return { type: 'kill', global: true, negative: true }
}

export function negateEffects(): Effect {
  return { type: 'negate', global: true, negative: false }
}

export function heal(): Effect {
  return { type: 'heal', global: false, negative: false }
}
