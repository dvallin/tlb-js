import { TlbWorld } from '../tlb'
import { Attack } from '../components/action'
import { Entity } from '../ecs/entity'
import { CharacterStatsComponent } from '../components/character-stats'
import { PositionComponent } from '../components/position'
import { Vector } from '../spatial'
import { calculateCover } from './cover'

export interface HitChanceCalculation {
  base: number
  distancePenalty: number
  coverPenalty: number
  final: number
}

export function calculateHitChance(world: TlbWorld, entity: Entity, target: Entity, attack: Attack): HitChanceCalculation {
  const stats = world.getComponent<CharacterStatsComponent>(entity, 'character-stats')!
  const position = world.getComponent<PositionComponent>(entity, 'position')!
  const targetPosition = world.getComponent<PositionComponent>(target, 'position')!

  const cover = calculateCover(world, targetPosition.level, position.position, targetPosition.position)

  const distance = new Vector([position.position.fX - targetPosition.position.fX, position.position.fY - targetPosition.position.fY]).lN()
  const normalizedDistance = Math.floor((10 * (distance - 1)) / attack.range)

  const base = stats.current.aim + attack.accuracy
  const distancePenalty = normalizedDistance < 5 ? 0 : normalizedDistance < 7 ? 2 : 3
  const coverPenalty = cover === 'full' ? 7 : cover === 'partial' ? 4 : 0
  return {
    base,
    distancePenalty,
    coverPenalty,
    final: (base - distancePenalty - coverPenalty) / 10,
  }
}
