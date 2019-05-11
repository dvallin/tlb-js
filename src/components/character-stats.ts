export type CharacterStatsType = keyof typeof characterStats
export interface CharacterStatsComponent {
  type: CharacterStatsType
  current: CharacterStats
}

export function createCharacterStatsComponent(type: CharacterStatsType): CharacterStatsComponent {
  return { type, current: { ...characterStats[type] } }
}

export interface BodyPart {
  kind: 'head' | 'arm' | 'torso' | 'leg'
  health: number
}

export interface CharacterStats {
  bodyParts: { [key: string]: BodyPart }
  movement: number
  actions: number
}

function humanoidBodyParts(health: number): { [key: string]: BodyPart } {
  return {
    head: { kind: 'head', health },
    leftArm: { kind: 'arm', health },
    rightArm: { kind: 'arm', health },
    torso: { kind: 'torso', health },
    leftLeg: { kind: 'leg', health },
    rightLeg: { kind: 'leg', health },
  }
}

export const characterStats = {
  player: {
    bodyParts: humanoidBodyParts(4),
    movement: 3,
    actions: 3,
  },
  guard: {
    bodyParts: humanoidBodyParts(4),
    movement: 3,
    actions: 3,
  },
  eliteGuard: {
    bodyParts: humanoidBodyParts(5),
    movement: 2,
    actions: 5,
  },
}
export const characterStatsTypeguard: { [key: string]: CharacterStats } = characterStats

export function speed(stats: CharacterStatsComponent): number {
  return stats.current.movement / 13
}
