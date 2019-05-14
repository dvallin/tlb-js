import { TlbWorld } from '../tlb'
import { Attack } from '../components/action'
import { Entity } from '../ecs/entity'
import { CharacterStatsComponent, bodyPartType } from '../components/character-stats'
import { PositionComponent } from '../components/position'
import { LightingComponent } from '../components/light'
import { EffectComponent } from '../components/effects'
import { Random } from '../random'
import { calculateBrightness } from './brigthness'
import { Log, LogResource } from '../resources/log'

export function attackTarget(world: TlbWorld, random: Random, entity: Entity, target: Entity, bodyPart: string, attack: Attack): void {
  const stats = world.getComponent<CharacterStatsComponent>(entity, 'character-stats')!
  const position = world.getComponent<PositionComponent>(entity, 'position')!
  const targetPosition = world.getComponent<PositionComponent>(target, 'position')!
  const targetStats = world.getComponent<CharacterStatsComponent>(target, 'character-stats')!
  const distance = position.position
    .floor()
    .minus(targetPosition.position.floor())
    .lN()
  const normalizedDistance = Math.floor((10 * distance) / attack.range)
  const lighting = world.getComponent<LightingComponent>(target, 'lighting')!
  const brightness = calculateBrightness(lighting)

  const baseChance = stats.current.aim + attack.accuracy
  const brightnessPenalty = brightness > 5 ? 0 : brightness > 3 ? 2 : 3
  const distancePenalty = normalizedDistance < 5 ? 0 : normalizedDistance < 7 ? 2 : 3
  const bodyPartPenalty = calculateBodyPartPenalty(targetStats.current.bodyParts[bodyPart].type)

  const hitChance = (baseChance - distancePenalty - brightnessPenalty - bodyPartPenalty) / 10
  const critChance = (baseChance - distancePenalty - bodyPartPenalty) / 10

  const log: Log = world.getResource<LogResource>('log')
  log.attack(world, entity, target, bodyPart, attack)

  if (random.decision(hitChance)) {
    attack.effects.forEach(effect =>
      world.createEntity().withComponent<EffectComponent>('effect', {
        source: entity,
        target: target!,
        value: attack.damage,
        effect,
        bodyPart,
      })
    )
    const isCritial = random.decision(critChance)
    if (isCritial) {
      attack.effects.forEach(effect =>
        world.createEntity().withComponent<EffectComponent>('effect', {
          source: entity,
          target: target!,
          value: attack.damage,
          effect,
          bodyPart,
        })
      )
    }
  } else {
    log.missed(world, entity)
  }
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
      return 2
  }
}
