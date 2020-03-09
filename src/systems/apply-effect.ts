import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { EffectComponent, ActiveEffectsComponent, Effect } from '../components/effects'
import { Entity } from '../ecs/entity'
import { CharacterStatsComponent } from '../components/character-stats'
import { LogResource, Log } from '../resources/log'
import { EquipedItemsComponent, ItemComponent } from '../components/items'
import { damageBodyPart, healBodyPart, kill } from '../component-reducers/damage-bodypart'
import { items } from '../assets/items'

export class ApplyEffects implements TlbSystem {
  public readonly components: ComponentName[] = ['effect']

  public update(world: TlbWorld, entity: Entity): void {
    const effectComponent = world.getComponent<EffectComponent>(entity, 'effect')!
    switch (effectComponent.effect.type) {
      case 'damage':
        this.applyDamage(world, effectComponent)
        break
      case 'kill':
        kill(world, effectComponent.target)
        break
      case 'negate':
        this.removeAllNegativeEffects(world, effectComponent)
        break
      case 'heal':
        this.applyHeal(world, effectComponent)
        break
      default:
        this.applyStatusEffect(world, effectComponent)
        break
    }
    world.deleteEntity(entity)
  }

  public applyDamage(world: TlbWorld, effectComponent: EffectComponent) {
    const { effect, source, target, bodyParts } = effectComponent
    const stats = world.getComponent<CharacterStatsComponent>(target, 'character-stats')

    if (stats !== undefined && bodyParts !== undefined) {
      const log: Log = world.getResource<LogResource>('log')

      console.error('not implemeted yet: splash damage onto to multiple body parts')
      bodyParts.forEach(bodyPart => {
        const equipment = world.getComponent<EquipedItemsComponent>(target, 'equiped-items')!
        const defensiveEffects: Effect[] = []
        equipment.equipment.forEach(equipment => {
          const item = items[world.getComponent<ItemComponent>(equipment.entity, 'item')!.type]
          item.effects.forEach((e: Effect) => {
            if (e.global || equipment.bodyParts.find(b => b === bodyPart)) {
              if (e.type === 'defend') {
                defensiveEffects.push(e)
              }
            }
          })
        })

        const activeEffects = world.getComponent<ActiveEffectsComponent>(target, 'active-effects')!
        activeEffects.effects.forEach(e => {
          if (e.effect.global || e.bodyPart === bodyPart) {
            if (e.effect.type === 'defend') {
              defensiveEffects.push(e.effect)
            }
          }
        })

        const defense = defensiveEffects.reduce((a, b) => a + b.value!, 0)
        let damage = Math.max(0, effect.value! - defense)
        log.effectApplied(world, effectComponent, bodyPart)
        if (damage > 0) {
          damageBodyPart(world, source, target, stats, bodyPart!, damage)
        }
      })
    }
  }

  public applyHeal(world: TlbWorld, effectComponent: EffectComponent) {
    const stats = world.getComponent<CharacterStatsComponent>(effectComponent.target, 'character-stats')
    if (stats !== undefined) {
      const log: Log = world.getResource<LogResource>('log')
      effectComponent.bodyParts!.forEach(bodyPart => {
        healBodyPart(stats, bodyPart)
        log.effectApplied(world, effectComponent, bodyPart)
      })
    }
  }

  public removeAllNegativeEffects(world: TlbWorld, effectComponent: EffectComponent) {
    const activeEffects = world.getComponent<ActiveEffectsComponent>(effectComponent.target, 'active-effects')!
    if (effectComponent.bodyParts !== undefined) {
      effectComponent.bodyParts.forEach(bodyPart => {
        activeEffects.effects = activeEffects.effects.filter(e => e.bodyPart === undefined || e.bodyPart !== bodyPart || !e.effect.negative)
      })
    } else {
      activeEffects.effects = activeEffects.effects.filter(e => !e.effect.negative)
    }
  }

  public applyStatusEffect(world: TlbWorld, effectComponent: EffectComponent) {
    const log: Log = world.getResource<LogResource>('log')
    const activeEffects = world.getComponent<ActiveEffectsComponent>(effectComponent.target, 'active-effects')!
    if (effectComponent.bodyParts !== undefined) {
      effectComponent.bodyParts.forEach(bodyPart => {
        log.effectApplied(world, effectComponent, bodyPart)
        activeEffects.effects.push({ effect: effectComponent.effect, bodyPart })
      })
    } else {
      activeEffects.effects.push({ effect: effectComponent.effect })
      log.effectApplied(world, effectComponent)
    }
  }
}
