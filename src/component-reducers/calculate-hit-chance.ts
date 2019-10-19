import { TlbWorld } from '../tlb'
import { Attack } from '../components/action'
import { Entity } from '../ecs/entity'
import { CharacterStatsComponent } from '../components/character-stats'
import { PositionComponent } from '../components/position'
import { getLighting } from '../components/light'
import { calculateBrightness } from './brigthness'
import { Vector } from '../spatial'

export function calculateHitChance(world: TlbWorld, entity: Entity, target: Entity, attack: Attack): number {
  const stats = world.getComponent<CharacterStatsComponent>(entity, 'character-stats')!
  const position = world.getComponent<PositionComponent>(entity, 'position')!
  const targetPosition = world.getComponent<PositionComponent>(target, 'position')!
  const distance = new Vector([position.position.fX - targetPosition.position.fX, position.position.fY - targetPosition.position.fY]).lN()
  const normalizedDistance = Math.floor((10 * (distance - 1)) / attack.range)
  const lighting = getLighting(world, target)
  const brightness = calculateBrightness(lighting)

  const baseChance = stats.current.aim + attack.accuracy
  const brightnessPenalty = brightness > 5 ? 0 : brightness > 3 ? 3 : 4
  const distancePenalty = normalizedDistance < 5 ? 0 : normalizedDistance < 7 ? 2 : 3
  console.log(`(10 * ${distance} - 1)  / ${attack.range}`)
  console.log(`${stats.current.aim} + ${attack.accuracy} - ${brightnessPenalty} - ${distancePenalty}`)
  return (baseChance - distancePenalty - brightnessPenalty) / 10
}
