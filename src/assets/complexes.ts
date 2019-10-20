import {
  ComplexTemplate,
  spawnTimes,
  spawn,
  spawnOptional,
  ComplexDescription,
  occur,
  StructureRestriction,
  CharacterCreator,
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

const complexesDefinition = {
  anEncounter: {
    structures: [
      {
        description: {
          decorations: [spawn<AssetType>('trash')],
          containers: [spawn<AssetType>('locker')],
          loots: [spawn<ItemType>('nailGun', 'leatherJacket'), spawnOptional<ItemType>('bootsOfStriding')],
          npcs: [spawn<CharacterCreator>(characterCreators.eliteGuard, characterCreators.guard)],
          bosses: [spawn<CharacterCreator>(boss1)],
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
          containers: [spawnTimes<AssetType>('table', 5)],
          loots: [spawn<ItemType>('bandages', 'deathPill')],
          npcs: [spawnTimes<CharacterCreator>(characterCreators.eliteGuard, 2), spawnTimes<CharacterCreator>(characterCreators.guard, 3)],
          bosses: [],
        },
        restriction: restriction({ kind: 'room', connects: [1] }),
      },
      {
        description: {
          decorations: [],
          containers: [spawnTimes<AssetType>('locker', 5)],
          loots: [spawnTimes<ItemType>('sniperRifle', 5), spawnTimes<ItemType>('bandages', 3), spawnTimes<ItemType>('leatherJacket', 5)],
          npcs: [spawn<CharacterCreator>(characterCreators.eliteGuard, characterCreators.guard)],
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
          decorations: [spawnTimes<AssetType>('generator', 3)],
          containers: [spawnOptional<AssetType>('locker')],
          loots: [spawnTimes<ItemType>('bandages', 2)],
          npcs: [],
          bosses: [],
        },
        restriction: restriction({ kind: 'corridor' }),
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
}
