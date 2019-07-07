import { TlbWorld } from '../tlb'
import { Attack } from '../components/action'
import { Entity } from '../ecs/entity'
import { EffectComponent } from '../components/effects'
import { Random } from '../random'
import { Log, LogResource } from '../resources/log'
import { calculateHitChance } from './calculate-hit-chance'

export function attackTarget(world: TlbWorld, random: Random, entity: Entity, target: Entity, bodyPart: string, attack: Attack): void {
  const { hitChance, critChance } = calculateHitChance(world, entity, target, bodyPart, attack)

  const log: Log = world.getResource<LogResource>('log')
  log.attack(world, entity, target, bodyPart, attack)
  if (random.decision(hitChance)) {
    const isCritial = random.decision(critChance)
    attack.effects.forEach(effect => {
      const value = effect.type === 'damage' && isCritial ? effect.value! * 2 : effect.value
      world.createEntity().withComponent<EffectComponent>('effect', {
        source: entity,
        target: target!,
        bodyPart,
        effect: {
          ...effect,
          value,
        },
      })
    })
  } else {
    log.missed(world, entity)
  }
}
