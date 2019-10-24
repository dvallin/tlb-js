import { Entity } from '../ecs/entity'
import { Effect } from './effects'
import { ActionType } from '../assets/actions'

export interface HasActionComponent {
  actions: ActionType[]
}

export interface Cost {
  actions: number
  movement: number
  costsAll?: boolean
}

export interface Movement {
  kind: 'movement'
  target: 'self'
  range: number
}

export interface Attack {
  kind: 'attack'
  target: 'enemy'
  effects: Effect[]
  range: number
  accuracy: number
}

export interface Status {
  kind: 'status'
  target: 'self'
  effects: Effect[]
}

export interface Action {
  cost: Cost
  name: string
  subActions: (Movement | Attack | Status)[]
}

export interface SelectedAction {
  entity: number
  action: Action
}

export interface SelectedActionComponent {
  selection?: SelectedAction
  target?: Entity
  skippedActions: number
  currentSubAction: number
}
