import { Entity } from '../ecs/entity'
import { effect } from './effects'

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
  effects: effect[]
  damage: number
  range: number
}

export interface HasActionComponent {
  actions: ActionType[]
}

export interface SelectedActionComponent {
  action?: Action
  target?: Entity
  skippedActions: number
  currentSubAction: number
}

export type ActionType = keyof typeof actions
export interface FeatureComponent {
  type: ActionType
}

export interface Action {
  cost: Cost
  description: string
  subActions: (Movement | Attack)[]
}

function movement(range: number): Movement {
  return { kind: 'movement', range }
}

function attack(range: number, damage: number, effects: effect[] = ['damage']): Attack {
  return { kind: 'attack', damage, range, effects }
}

export const actions = {
  endTurn: {
    description: 'end turn',
    cost: {
      actions: 0,
      movement: 0,
      costsAll: true,
    },
    subActions: [],
  },
  move: {
    description: 'move',
    cost: {
      actions: 0,
      movement: 2,
    },
    subActions: [movement(5)],
  },
  hit: {
    description: 'hit',
    cost: {
      actions: 2,
      movement: 0,
    },
    subActions: [attack(1, 4)],
  },
  rush: {
    description: 'rush',
    cost: {
      actions: 2,
      movement: 3,
      costsAll: true,
    },
    subActions: [movement(8)],
  },
  shoot: {
    description: 'shoot',
    cost: {
      actions: 3,
      movement: 0,
    },
    subActions: [attack(5, 4)],
  },
  overcharge: {
    description: 'overcharge',
    cost: {
      actions: 3,
      movement: 0,
    },
    attack: {},
    subActions: [attack(3, 5)],
  },
  execute: {
    description: 'execute',
    cost: {
      actions: 3,
      movement: 0,
    },
    subActions: [attack(1, 13, ['damage', 'confuse'])],
  },
  hitAndRun: {
    description: 'hit and run',
    cost: {
      actions: 3,
      movement: 3,
    },
    subActions: [attack(1, 7, ['damage']), movement(5)],
  },
}
export const actionsTypeguard: { [key: string]: Action } = actions
