import { TlbWorld } from '../tlb'
import { Attack } from '../components/action'
import { Entity } from '../ecs/entity'
import { CharacterStatsComponent } from '../components/character-stats'
import { PositionComponent } from '../components/position'
import { Vector } from '../spatial'

export function calculateHitChance(world: TlbWorld, entity: Entity, target: Entity, attack: Attack): number {
  const stats = world.getComponent<CharacterStatsComponent>(entity, 'character-stats')!
  const position = world.getComponent<PositionComponent>(entity, 'position')!
  const targetPosition = world.getComponent<PositionComponent>(target, 'position')!
  const distance = new Vector([position.position.fX - targetPosition.position.fX, position.position.fY - targetPosition.position.fY]).lN()
  const normalizedDistance = Math.floor((10 * (distance - 1)) / attack.range)

  const baseChance = stats.current.aim + attack.accuracy
  const distancePenalty = normalizedDistance < 5 ? 0 : normalizedDistance < 7 ? 2 : 3
  console.log(`(10 * ${distance} - 1)  / ${attack.range}`)
  console.log(`${stats.current.aim} + ${attack.accuracy} - ${distancePenalty}`)
  return (baseChance - distancePenalty) / 10
}
