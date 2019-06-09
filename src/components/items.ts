import { ActionType } from './action'
import { Entity } from '../ecs/entity'
import { Effect } from './effects'

export interface Item {
  kind: 'weapon' | 'consumable' | 'equipment'
  name: string
  description: string
  actions: ActionType[]
  effects: Effect[]
  weight: number
}

export type ItemType = keyof typeof items
export const items = {
  nailGun: weapon('nail gun', 'a tool to drive nails into wood, control panels or bodies.', 5, [], ['overcharge', 'hitAndRun', 'bolt']),
  rifle: weapon('rifle', 'a regular rifle.', 5, [], ['shoot']),
  deathPill: consumable('death pill', 'a pill that kills you', 1, [{ type: 'kill', global: true, negated: false }]),
  bandages: consumable('bandages', 'a bandage to stop bleeding', 1, [{ type: 'bleed', global: false, negated: true }]),
  leatherJacket: equipment(
    'leather jacket',
    'a nice leather jacket',
    3,
    [{ type: 'defend', global: false, negated: false, value: 1 }],
    ['tighten']
  ),
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

function weapon(name: string, description: string, weight: number, effects: Effect[], actions: ActionType[]): Item {
  return { kind: 'weapon', name, description, actions, effects, weight }
}

function consumable(name: string, description: string, weight: number, effects: Effect[]): Item {
  return { kind: 'consumable', name, description, actions: ['consume'], effects, weight }
}

function equipment(name: string, description: string, weight: number, effects: Effect[], actions: ActionType[]): Item {
  return { kind: 'equipment', name, description, actions, effects, weight }
}
