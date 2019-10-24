import { ActionType } from './actions'
import { Item, WearableKind } from '../components/items'
import { Effect, defend } from '../components/effects'

function weapon(name: string, description: string, weight: number, actions: ActionType[], attachments: number): Item {
  return { kind: 'weapon', name, description, actions, weight, attachments, effects: [] }
}

function consumable(name: string, description: string, weight: number, action: ActionType): Item {
  return { kind: 'consumable', attachments: 0, actions: [action], name, description, weight, effects: [] }
}

function scrap(name: string, description: string): Item {
  return { kind: 'scrap', attachments: 0, actions: [], name, description, weight: 0, effects: [] }
}

function equipment(
  kind: WearableKind,
  name: string,
  description: string,
  weight: number,
  actions: ActionType[],
  effects: Effect[],
  attachments: number
): Item {
  return { kind, name, description, actions, weight, attachments, effects }
}

const itemsDefinition = {
  nailGun: weapon('nail gun', 'a tool to drive nails into wood, control panels or bodies.', 5, ['overcharge', 'hitAndRun', 'bolt'], 1),
  rifle: weapon('rifle', 'a regular rifle.', 5, ['shoot'], 2),
  sniperRifle: weapon('sniper rifle', '', 6, ['headshot', 'shoot'], 2),
  deathPill: consumable('death pill', 'a pill that kills you', 1, 'kill'),
  bandages: consumable('bandages', 'a bandage to stop bleeding', 1, 'healLimp'),
  leatherJacket: equipment('armor', 'leather jacket', 'a nice leather jacket', 3, ['tighten'], [defend(3, 1)], 1),
  bootsOfStriding: equipment(
    'boots',
    'boots of striding',
    'Original Boots Of Striding TM, authentic D&D merch but not at all mint anymore',
    3,
    ['strideAndSlip'],
    [],
    2
  ),
  idCard: scrap('id card', 'id card'),
}
export type ItemType = keyof typeof itemsDefinition
export const items: { [key in ItemType]: Item } = itemsDefinition
