import { ItemKind } from './items'

export type CharacterStatsType = keyof typeof characterStats
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
  movement: number
  actions: number
  aim: number
}

function humanoidBodyParts(health: number): { [key: string]: BodyPart } {
  return {
    head: { type: 'head', itemAttachments: ['helmet'], health },
    leftArm: { type: 'arm', itemAttachments: ['glove', 'weapon'], health },
    rightArm: { type: 'arm', itemAttachments: ['glove', 'weapon'], health },
    torso: { type: 'torso', itemAttachments: ['armor'], health },
    leftLeg: { type: 'leg', itemAttachments: ['pants', 'boots'], health },
    rightLeg: { type: 'leg', itemAttachments: ['pants', 'boots'], health },
  }
}

export const characterStats = {
  player: {
    bodyParts: humanoidBodyParts(14),
    strength: 5,
    movement: 3,
    actions: 3,
    aim: 7,
  },
  guard: {
    bodyParts: humanoidBodyParts(8),
    strength: 5,
    movement: 3,
    actions: 3,
    aim: 3,
  },
  eliteGuard: {
    bodyParts: humanoidBodyParts(12),
    strength: 8,
    movement: 2,
    actions: 5,
    aim: 6,
  },
}
export const characterStatsTypeguard: { [key: string]: CharacterStats } = characterStats

export function speed(stats: CharacterStatsComponent): number {
  return stats.current.movement / 13
}
