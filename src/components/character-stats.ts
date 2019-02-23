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
  energy: number
  movement: number
  actions: number
  defense: number
  aim: number
}

export const characterStats = {
  player: {
    health: 10,
    energy: 4,
    movement: 6,
    actions: 5,
    defense: 10,
    aim: 10,
  },
  guard: {
    health: 7,
    energy: 4,
    movement: 6,
    actions: 3,
    defense: 10,
    aim: 10,
  },
  eliteGuard: {
    health: 10,
    energy: 4,
    movement: 4,
    actions: 5,
    defense: 20,
    aim: 10,
  },
}

export function speed(stats: CharacterStatsComponent): number {
  return stats.current.movement / 42
}
