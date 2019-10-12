import { Effect } from '../components/effects'
import { ActionType } from './actions'
import { Item, WearableKind } from '../components/items'

function weapon(name: string, description: string, weight: number, effects: Effect[], actions: ActionType[], attachments: number): Item {
  return { kind: 'weapon', name, description, actions, effects, weight, attachments }
}

function consumable(name: string, description: string, weight: number, effects: Effect[]): Item {
  return { kind: 'consumable', attachments: 0, actions: ['consume'], name, description, effects, weight }
}

function equipment(
  kind: WearableKind,
  name: string,
  description: string,
  weight: number,
  effects: Effect[],
  actions: ActionType[],
  attachments: number
): Item {
  return { kind, name, description, actions, effects, weight, attachments }
}

export const itemsDefinition = {
  nailGun: weapon('nail gun', 'a tool to drive nails into wood, control panels or bodies.', 5, [], ['overcharge', 'hitAndRun', 'bolt'], 1),
  rifle: weapon('rifle', 'a regular rifle.', 5, [], ['shoot'], 2),
  sniperRifle: weapon('sniper rifle', '', 6, [], ['headshot', 'shoot'], 2),
  deathPill: consumable('death pill', 'a pill that kills you', 1, [{ type: 'kill', global: true, negated: false }]),
  bandages: consumable('bandages', 'a bandage to stop bleeding', 1, [{ type: 'bleed', global: false, negated: true }]),
  leatherJacket: equipment(
    'armor',
    'leather jacket',
    'a nice leather jacket',
    3,
    [{ type: 'defend', global: false, negated: false, value: 1 }],
    ['tighten'],
    1
  ),
  bootsOfStriding: equipment(
    'boots',
    'boots of striding',
    'Original Boots Of Striding TM, authentic D&D merch but not at all mint anymore',
    3,
    [],
    ['strideAndSlip'],
    2
  ),
}
export type ItemType = keyof typeof itemsDefinition
export const items: { [key in ItemType]: Item } = itemsDefinition
