import {
  ComplexTemplate,
  spawn,
  ComplexDescription,
  occur,
  StructureRestriction,
  CharacterCreator,
  optional,
} from '../generative/complex-embedder'
import { characterCreators, createEmptyNpc, defaultActions, take, equip } from './characters'
import { AssetType } from './assets'
import { ItemType } from './items'
import { RegionsType } from '../components/region'
import { addDialog } from './dialogs'

function restriction(restriction: Partial<StructureRestriction>): Partial<StructureRestriction> {
  return restriction
}

const boss1: CharacterCreator = world => {
  const boss = createEmptyNpc(world, 'overseer', 'boss', 'eliteGuard', defaultActions)
  addDialog(world, boss, 'guardRandomRemarks')
  take(world, boss, 'rifle')
  take(world, boss, 'bootsOfStriding')
  equip(world, boss, 'nailGun', ['leftArm'])
  equip(world, boss, 'leatherJacket', ['torso', 'leftArm', 'rightArm'])
  return boss
}

const complexesDefinition: { [key: string]: ComplexTemplate } = {
  anEncounter: {
    structures: [
      {
        description: {
          decorations: [spawn<AssetType>('random', occur(1), 'trash')],
          containers: [spawn<AssetType>('wall', occur(1), 'locker')],
          loots: [spawn<ItemType>('random', occur(1), 'nailGun', 'leatherJacket'), spawn<ItemType>('random', occur(1), 'bootsOfStriding')],
          npcs: [spawn<CharacterCreator>('random', occur(1), characterCreators.eliteGuard, characterCreators.guard)],
          bosses: [spawn<CharacterCreator>('random', occur(1), boss1)],
        },
        restriction: restriction({ kind: 'room' }),
      },
    ],
  },
  guardsStation: {
    structures: [
      {
        description: {
          decorations: [],
          containers: [spawn<AssetType>('random', occur(5), 'table')],
          loots: [spawn<ItemType>('random', occur(1), 'bandages', 'deathPill')],
          npcs: [
            spawn<CharacterCreator>('random', occur(2), characterCreators.eliteGuard),
            spawn<CharacterCreator>('random', occur(3), characterCreators.guard),
          ],
          bosses: [],
        },
        restriction: restriction({ kind: 'room', connects: [1] }),
      },
      {
        description: {
          decorations: [],
          containers: [spawn<AssetType>('wall', occur(5), 'locker')],
          loots: [
            spawn<ItemType>('random', occur(5), 'sniperRifle'),
            spawn<ItemType>('random', occur(3), 'bandages'),
            spawn<ItemType>('random', occur(5), 'leatherJacket'),
          ],
          npcs: [spawn<CharacterCreator>('random', occur(1), characterCreators.eliteGuard, characterCreators.guard)],
          bosses: [],
        },
        restriction: restriction({ kind: 'room', connects: [0], exact: true }),
      },
    ],
  },
  generators: {
    structures: [
      {
        description: {
          decorations: [spawn<AssetType>('random', occur(3), 'generator')],
          containers: [spawn<AssetType>('random', optional(1), 'locker')],
          loots: [spawn<ItemType>('random', occur(2), 'bandages')],
          npcs: [],
          bosses: [],
        },
        restriction: restriction({ kind: 'corridor' }),
      },
    ],
  },
  elevator: {
    structures: [
      {
        description: {
          decorations: [spawn<AssetType>('center', occur(1), 'elevator')],
          containers: [],
          loots: [],
          npcs: [],
          bosses: [],
        },
        restriction: restriction({ kind: 'hub' }),
      },
    ],
  },
}
export type ComplexesType = keyof typeof complexesDefinition
export const complexes: { [key in ComplexesType]: ComplexTemplate } = complexesDefinition

export const regionParams: { [key in RegionsType]: ComplexDescription[] } = {
  red: [
    {
      occurrence: occur(1, 2),
      template: complexes.anEncounter,
    },
    {
      occurrence: occur(1),
      template: complexes.guardsStation,
    },
    {
      occurrence: occur(1, 2),
      template: complexes.generators,
    },
  ],
  elevator: [{ occurrence: occur(1), template: complexes.elevator }],
}
