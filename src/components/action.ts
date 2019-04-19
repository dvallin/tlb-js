import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'

export interface Cost {
  actions: number
  movement: number
  costsAll?: boolean
}

export interface Movement {
  range: number
}

export interface Attack {
  damage: number
  range: number
}

export interface HasActionComponent {
  actions: ActionType[]
}

export interface SelectedActionComponent {
  action?: Action
  target?: Entity
  position?: Vector
  handledMovement: boolean
  handledAttack: boolean
  skippedMovement: boolean
  skippedAttack: boolean
}

export type ActionType = keyof typeof actions
export interface FeatureComponent {
  type: ActionType
}

export interface Action {
  cost: Cost
  description: string
  movement?: Movement
  attack?: Attack
}

export const actions: { [key: string]: Action } = {
  endTurn: {
    description: 'end turn',
    cost: {
      actions: 0,
      movement: 0,
      costsAll: true,
    },
  },
  move: {
    description: 'move',
    cost: {
      actions: 0,
      movement: 2,
    },
    movement: {
      range: 8,
    },
  },
  hit: {
    description: 'hit',
    cost: {
      actions: 2,
      movement: 0,
    },
    attack: {
      damage: 6,
      range: 1,
    },
  },
  rush: {
    description: 'rush',
    cost: {
      actions: 2,
      movement: 3,
      costsAll: true,
    },
    movement: {
      range: 12,
    },
  },
  shoot: {
    description: 'shoot',
    cost: {
      actions: 3,
      movement: 0,
    },
    attack: {
      damage: 4,
      range: 5,
    },
  },
}
