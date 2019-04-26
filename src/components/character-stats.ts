export type CharacterStatsType = keyof typeof characterStats
export interface CharacterStatsComponent {
  type: CharacterStatsType
  current: CharacterStats
}

export function createCharacterStatsComponent(type: CharacterStatsType): CharacterStatsComponent {
  return { type, current: { ...characterStats[type] } }
}

export interface CharacterStats {
  health: number
  movement: number
  actions: number
  defense: number
}

export const characterStats = {
  player: {
    health: 10,
    movement: 3,
    actions: 3,
    defense: 4,
  },
  guard: {
    health: 7,
    movement: 3,
    actions: 3,
    defense: 3,
  },
  eliteGuard: {
    health: 10,
    movement: 2,
    actions: 5,
    defense: 5,
  },
}
export const characterStatsTypeguard: { [key: string]: CharacterStats } = characterStats

export function speed(stats: CharacterStatsComponent): number {
  return stats.current.movement / 13
}
