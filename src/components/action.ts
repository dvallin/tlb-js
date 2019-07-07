import { Entity } from '../ecs/entity'
import { damage, Effect, confuse, stun, immobilize, defend } from './effects'

export interface Cost {
  actions: number
  movement: number
  costsAll?: boolean
}

export interface Movement {
  kind: 'movement'
  range: number
}

export interface Attack {
  kind: 'attack'
  effects: Effect[]
  range: number
  accuracy: number
}

export interface Status {
  kind: 'status'
  effects: Effect[]
}

export interface SelectedAction {
  entity: number
  action: Action
}

export interface HasActionComponent {
  actions: ActionType[]
}

export interface SelectedActionComponent {
  selection?: SelectedAction
  target?: Entity
  skippedActions: number
  currentSubAction: number
}

export type ActionType = keyof typeof actions

export interface Action {
  cost: Cost
  name: string
  subActions: (Movement | Attack | Status)[]
}

function movement(range: number): Movement {
  return { kind: 'movement', range }
}

function attack(range: number, accuracy: number, effects: Effect[]): Attack {
  return { kind: 'attack', range, accuracy, effects }
}

function status(effects: Effect[]): Status {
  return { kind: 'status', effects }
}

export const actions = {
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
  consume: {
    name: 'consume',
    cost: {
      actions: 1,
      movement: 0,
    },
    subActions: [],
  },
  longMove: {
    name: 'move',
    cost: {
      actions: 0,
      movement: 2,
    },
    subActions: [movement(5)],
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
    subActions: [attack(5, 4, [damage(5)])],
  },
  overcharge: {
    name: 'overcharge',
    cost: {
      actions: 3,
      movement: 0,
    },
    attack: {},
    subActions: [attack(3, 4, [damage(3), immobilize(1)])],
  },
  bolt: {
    name: 'bolt',
    cost: {
      actions: 3,
      movement: 0,
    },
    subActions: [attack(1, 5, [damage(7), stun(1)])],
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
export const actionsTypeguard: { [key: string]: Action } = actions
