import {
  ComplexTemplate,
  spawnTimes,
  spawn,
  spawnOptional,
  ComplexDescription,
  occur,
  StructureRestriction,
} from '../generative/complex-embedder'
import { CharacterStatsType } from './characters'
import { AssetType } from './assets'
import { ItemType } from './items'
import { RegionsType } from '../components/region'

function restriction(restriction: Partial<StructureRestriction>): Partial<StructureRestriction> {
  return restriction
}

const complexesDefinition = {
  anEncounter: {
    structures: [
      {
        description: {
          decorations: [spawn<AssetType>('trash')],
          containers: [spawn<AssetType>('locker')],
          loots: [spawn<ItemType>('nailGun', 'leatherJacket'), spawnOptional<ItemType>('bootsOfStriding')],
          npcs: [spawn<CharacterStatsType>('eliteGuard', 'guard')],
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
          containers: [],
          loots: [],
          npcs: [spawnTimes<CharacterStatsType>('eliteGuard', 2), spawnTimes<CharacterStatsType>('guard', 3)],
        },
        restriction: restriction({ kind: 'room', connects: [1] }),
      },
      {
        description: {
          decorations: [],
          containers: [spawnTimes<AssetType>('locker', 5)],
          loots: [spawnTimes<ItemType>('rifle', 5), spawnTimes<ItemType>('bandages', 3), spawnTimes<ItemType>('leatherJacket', 5)],
          npcs: [spawn<CharacterStatsType>('eliteGuard', 'guard')],
        },
        restriction: restriction({ kind: 'room', connects: [0], exact: true }),
      },
    ],
  },
}
export type ComplexesType = keyof typeof complexesDefinition
export const complexes: { [key in ComplexesType]: ComplexTemplate } = complexesDefinition

export const regionParams: { [key in RegionsType]: ComplexDescription[] } = {
  red: [
    {
      occurrence: occur(1, 3),
      template: complexes.anEncounter,
    },
    {
      occurrence: occur(1),
      template: complexes.guardsStation,
    },
  ],
}
