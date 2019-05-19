import { ActionType } from './action'
import { Entity } from '../ecs/entity'
import { Effect } from './effects'

export interface Item {
  kind: 'weapon' | 'consumable' | 'equipment'
  name: string
  description: string
  actions: ActionType[]
  effects: Effect[]
}

export type ItemType = keyof typeof items
export const items = {
  nailGun: weapon('nail gun', 'a tool to drive nails into wood, control panels or bodies.', [], ['overcharge', 'hitAndRun', 'bolt']),
  rifle: weapon('rifle', 'a regular rifle.', [], ['shoot']),
  deathPill: consumable('death pill', 'a pill that kills you', [{ type: 'kill', global: true, negated: false }]),
  bandages: consumable('bandages', 'a bandage to stop bleeding', [{ type: 'bleed', global: false, negated: true }]),
  leatherJacket: equipment('leather jacket', 'a nice leather jacket', [{ type: 'defend', global: false, negated: false, value: 1 }]),
}
export const itemsTypeguard: { [key: string]: Item } = items

export interface InventoryComponent {
  content: Entity[]
}

export interface ItemComponent {
  type: ItemType
}

export interface EquipmentAttachement {
  entity: Entity
  bodyParts: string[]
}

export interface EquipedItemsComponent {
  equipment: EquipmentAttachement[]
}

function weapon(name: string, description: string, effects: Effect[], actions: ActionType[]): Item {
  return { kind: 'weapon', name, description, actions, effects }
}

function consumable(name: string, description: string, effects: Effect[]): Item {
  return { kind: 'consumable', name, description, actions: ['consume'], effects }
}

function equipment(name: string, description: string, effects: Effect[]): Item {
  return { kind: 'equipment', name, description, actions: [], effects }
}
