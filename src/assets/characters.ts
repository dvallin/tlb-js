import { BodyPart, CharacterStats } from '../components/character-stats'

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

const charactersStatsDefinition = {
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
export type CharacterStatsType = keyof typeof charactersStatsDefinition
export const characterStats: { [key in CharacterStatsType]: CharacterStats } = charactersStatsDefinition
