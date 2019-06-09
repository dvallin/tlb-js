import { TlbWorld } from '../tlb'
import { Attack } from '../components/action'
import { Entity } from '../ecs/entity'
import { CharacterStatsComponent, bodyPartType } from '../components/character-stats'
import { PositionComponent } from '../components/position'
import { LightingComponent } from '../components/light'
import { calculateBrightness } from './brigthness'

export interface HitChance {
  hitChance: number
  critChance: number
}

export function calculateHitChance(world: TlbWorld, entity: Entity, target: Entity, bodyPart: string, attack: Attack): HitChance {
  const stats = world.getComponent<CharacterStatsComponent>(entity, 'character-stats')!
  const position = world.getComponent<PositionComponent>(entity, 'position')!
  const targetPosition = world.getComponent<PositionComponent>(target, 'position')!
  const targetStats = world.getComponent<CharacterStatsComponent>(target, 'character-stats')!
  const distance = position.position
    .floor()
    .minus(targetPosition.position.floor())
    .lN()
  const normalizedDistance = Math.floor((10 * (distance - 1)) / attack.range)
  const lighting = world.getComponent<LightingComponent>(target, 'lighting')!
  const brightness = calculateBrightness(lighting)

  const baseChance = stats.current.aim + attack.accuracy
  const brightnessPenalty = brightness > 5 ? 0 : brightness > 3 ? 3 : 4
  const distancePenalty = normalizedDistance < 5 ? 0 : normalizedDistance < 7 ? 2 : 3
  const bodyPartPenalty = calculateBodyPartPenalty(targetStats.current.bodyParts[bodyPart].type)

  const hitChance = (baseChance - distancePenalty - brightnessPenalty - bodyPartPenalty) / 10
  const critChance = (stats.current.aim - distancePenalty - bodyPartPenalty) / 20
  return { hitChance, critChance }
}

function calculateBodyPartPenalty(type: bodyPartType): number {
  switch (type) {
    case 'arm':
      return 1
    case 'leg':
      return 1
    case 'torso':
      return 0
    case 'head':
      return 3
  }
}
