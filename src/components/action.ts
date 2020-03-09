import { Effect } from './effects'
import { ActionType } from '../assets/actions'

export interface HasActionComponent {
  actions: ActionType[]
}

export type Cost = 'action' | 'movement' | 'all' | 'both'

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
  name: string
  cost: Cost
  subActions: (Movement | Attack | Status)[]
}
export function action(name: string, cost: Cost, subActions: (Movement | Attack | Status)[]): Action {
  return { name, cost, subActions }
}

export interface SelectedAction {
  entity: number
  action: Action
}
