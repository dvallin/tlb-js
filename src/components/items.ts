import { ActionType } from './action'
import { Entity } from '../ecs/entity'

export interface Item {
  name: string
  description: string
  actions: ActionType[]
}

export type ItemType = keyof typeof items
export const items = {
  nailGun: item('nail gun', 'a tool to drive nails into wood, control panels or bodies.', ['execute', 'overcharge', 'hitAndRun']),
  rifle: item('rifle', 'a regular rifle.', ['shoot']),
}
export const itemsTypeguard: { [key: string]: Item } = items

function item(name: string, description: string, actions: ActionType[]): Item {
  return { name, description, actions }
}

export interface InventoryComponent {
  content: Entity[]
}

export interface ItemComponent {
  type: ItemType
}

export interface EquipmentComponent {
  equiped: Entity[]
}
