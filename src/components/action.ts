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
  accuracy: number
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
export interface FeatureComponent {
  type: ActionType
}

export interface Action {
  cost: Cost
  name: string
  subActions: (Movement | Attack)[]
}

function movement(range: number): Movement {
  return { kind: 'movement', range }
}

function attack(range: number, damage: number, accuracy: number, effects: effect[] = ['damage']): Attack {
  return { kind: 'attack', damage, range, accuracy, effects }
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
  move: {
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
    subActions: [attack(1, 1, 10)],
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
    subActions: [attack(5, 2, 5)],
  },
  overcharge: {
    name: 'overcharge',
    cost: {
      actions: 3,
      movement: 0,
    },
    attack: {},
    subActions: [attack(3, 3, 3)],
  },
  execute: {
    name: 'execute',
    cost: {
      actions: 3,
      movement: 0,
    },
    subActions: [attack(1, 5, 10, ['damage', 'confuse'])],
  },
  hitAndRun: {
    name: 'hit and run',
    cost: {
      actions: 3,
      movement: 3,
    },
    subActions: [attack(1, 2, 3, ['damage']), movement(5)],
  },
}
export const actionsTypeguard: { [key: string]: Action } = actions
