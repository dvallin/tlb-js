import { TlbWorld } from '../tlb'
import { Attack, Action } from '../components/action'
import { Entity } from '../ecs/entity'
import { EffectComponent, Effect } from '../components/effects'
import { Random } from '../random'
import { Log, LogResource } from '../resources/log'
import { calculateHitChance } from './calculate-hit-chance'
import { CharacterStatsComponent } from '../components/character-stats'

export function attackTarget(world: TlbWorld, random: Random, entity: Entity, target: Entity, action: Action, attack: Attack): void {
  const chance = calculateHitChance(world, entity, target, attack)

  const log: Log = world.getResource<LogResource>('log')
  log.attack(world, entity, target, action)

  if (random.decision(chance.final)) {
    attack.effects.forEach(effect => {
      const bodyParts = getAfflictedBodyparts(world, random, target, effect)
      world.createEntity().withComponent<EffectComponent>('effect', {
        source: entity,
        target: target!,
        bodyParts,
        effect,
      })
    })
  } else {
    log.missed(world, entity)
  }
}

export function getAfflictedBodyparts(world: TlbWorld, random: Random, target: Entity, effect: Effect): string[] | undefined {
  if (effect.global) {
    return undefined
  } else {
    const stats = world.getComponent<CharacterStatsComponent>(target, 'character-stats')!
    let available: string[] = Object.keys(stats.current.bodyParts)
    if (effect.restricted !== undefined) {
      available = Object.keys(stats.current.bodyParts).filter(key => {
        const part = stats.current.bodyParts[key]
        return effect.restricted!.find(t => t === part.type)
      })
    }
    return [random.pick(available)]
  }
}
