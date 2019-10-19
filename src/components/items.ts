import { Entity } from '../ecs/entity'
import { Effect } from './effects'
import { ItemType } from '../assets/items'
import { ActionType } from '../assets/actions'

export type WearableKind = 'glove' | 'helmet' | 'armor' | 'pants' | 'boots'
export type ItemKind = 'scrap' | 'consumable' | 'weapon' | WearableKind

export interface Item {
  kind: ItemKind
  name: string
  description: string
  actions: ActionType[]
  effects: Effect[]
  weight: number
  attachments: number
}

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
