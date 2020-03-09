import { Action, action, Movement, Status, Attack } from '../components/action'
import { Effect, damage, confuse, stun, immobilize, kill, heal, negateEffects, defend } from '../components/effects'

function movement(range: number): Movement {
  return { kind: 'movement', range, target: 'self' }
}

function attack(range: number, accuracy: number, effects: Effect[]): Attack {
  return { kind: 'attack', range, accuracy, effects, target: 'enemy' }
}

function status(effects: Effect[]): Status {
  return { kind: 'status', effects, target: 'self' }
}

const actionsDefinition = {
  endTurn: action('end turn', 'both', []),
  move: action('move', 'movement', [movement(4)]),
  healLimp: action('heal body part', 'action', [status([heal(), negateEffects()])]),
  kill: action('kill', 'action', [status([kill()])]),
  hit: action('hit', 'action', [attack(1, 8, [damage(3)])]),
  strideAndSlip: action('stride and slip', 'movement', [movement(8), status([immobilize(1)])]),
  rush: action('rush', 'all', [movement(6)]),
  shoot: action('shoot', 'action', [attack(10, 4, [damage(5)])]),
  headshot: action('headshot', 'action', [attack(20, 10, [damage(5, ['head'])])]),
  overcharge: action('overcharge', 'action', [attack(8, 4, [damage(3), immobilize(1)])]),
  doubleShot: action('double shot', 'action', [attack(4, 4, [damage(3)]), attack(4, 4, [damage(3)])]),
  bolt: action('bolt', 'action', [attack(1, 5, [damage(2, ['head']), stun(1)])]),
  hitAndRun: action('move', 'action', [attack(1, 4, [damage(3), confuse(1)]), movement(6)]),
  tighten: action('tighten', 'action', [status([defend(2, 1)])]),
}
export type ActionType = keyof typeof actionsDefinition
export const actions: { [key in ActionType]: Action } = actionsDefinition
