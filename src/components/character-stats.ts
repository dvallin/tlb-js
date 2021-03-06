import { ItemKind } from './items'
import { characterStats, CharacterStatsType } from '../assets/characters'

export interface CharacterStatsComponent {
  type: CharacterStatsType
  current: CharacterStats
}

export function createCharacterStatsComponent(type: CharacterStatsType): CharacterStatsComponent {
  return { type, current: JSON.parse(JSON.stringify(characterStats[type])) }
}

export type bodyPartType = 'head' | 'arm' | 'torso' | 'leg'

export interface BodyPart {
  type: bodyPartType
  itemAttachments: ItemKind[]
  health: number
}

export interface CharacterStats {
  bodyParts: { [key: string]: BodyPart }
  strength: number
  aim: number
}

export function speed(_stats: CharacterStatsComponent): number {
  return 0.4
}
