import { Action, Movement, Status, Attack } from '../components/action'
import { Effect, damage, confuse, stun, immobilize, defend, kill, heal, negateEffects } from '../components/effects'

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
  endTurn: {
    name: 'end turn',
    cost: {
      actions: 0,
      movement: 0,
      costsAll: true,
    },
    subActions: [],
  },
  shortMove: {
    name: 'move',
    cost: {
      actions: 0,
      movement: 2,
    },
    subActions: [movement(3)],
  },
  longMove: {
    name: 'move',
    cost: {
      actions: 0,
      movement: 2,
    },
    subActions: [movement(5)],
  },
  healLimp: {
    name: 'healLimp',
    cost: {
      actions: 1,
      movement: 0,
    },
    subActions: [status([heal(), negateEffects()])],
  },
  kill: {
    name: 'kill',
    cost: {
      actions: 1,
      movement: 0,
    },
    subActions: [status([kill()])],
  },
  hit: {
    name: 'hit',
    cost: {
      actions: 2,
      movement: 0,
    },
    subActions: [attack(1, 8, [damage(3)])],
  },
  strideAndSlip: {
    name: 'stride and slip',
    cost: {
      actions: 0,
      movement: 3,
    },
    subActions: [movement(8), status([immobilize(1)])],
  },
  rush: {
    name: 'rush',
    cost: {
      actions: 2,
      movement: 3,
      costsAll: true,
    },
    subActions: [movement(8)],
  },
  shoot: {
    name: 'shoot',
    cost: {
      actions: 3,
      movement: 0,
    },
    subActions: [attack(10, 4, [damage(5)])],
  },
  headshot: {
    name: 'headshot',
    cost: {
      actions: 4,
      movement: 0,
    },
    subActions: [attack(20, 10, [damage(5, ['head'])])],
  },
  overcharge: {
    name: 'overcharge',
    cost: {
      actions: 3,
      movement: 0,
    },
    attack: {},
    subActions: [attack(8, 4, [damage(3), immobilize(1)])],
  },
  bolt: {
    name: 'bolt',
    cost: {
      actions: 3,
      movement: 0,
    },
    subActions: [attack(1, 5, [damage(2, ['head']), stun(1)])],
  },
  hitAndRun: {
    name: 'hit and run',
    cost: {
      actions: 3,
      movement: 3,
    },
    subActions: [attack(1, 4, [damage(3), confuse(1)]), movement(6)],
  },
  tighten: {
    name: 'tighten',
    cost: {
      actions: 1,
      movement: 0,
    },
    subActions: [status([defend(2, 1)])],
  },
}
export type ActionType = keyof typeof actionsDefinition
export const actions: { [key in ActionType]: Action } = actionsDefinition
