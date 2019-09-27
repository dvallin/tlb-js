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
        if (effectComponent.effect.negated) {
          this.applyHeal(world, effectComponent)
        } else {
          this.applyDamage(world, effectComponent)
        }
        break
      case 'kill':
        kill(world, effectComponent.target)
        break
      default:
        this.applyStatusEffect(world, effectComponent)
        break
    }
    world.deleteEntity(entity)
  }

  public applyDamage(world: TlbWorld, effectComponent: EffectComponent) {
    const stats = world.getComponent<CharacterStatsComponent>(effectComponent.target, 'character-stats')
    const { effect } = effectComponent

    if (stats !== undefined) {
      const log: Log = world.getResource<LogResource>('log')

      const equipment = world.getComponent<EquipedItemsComponent>(effectComponent.target, 'equiped-items')!
      const defensiveEffects: Effect[] = []
      equipment.equipment.forEach(equipment => {
        const item = items[world.getComponent<ItemComponent>(equipment.entity, 'item')!.type]
        item.effects.forEach((e: Effect) => {
          if (e.global || equipment.bodyParts.find(b => b === effectComponent.bodyPart)) {
            if (e.type === 'defend') {
              defensiveEffects.push(e)
            }
          }
        })
      })

      const activeEffects = world.getComponent<ActiveEffectsComponent>(effectComponent.target, 'active-effects')!
      activeEffects.effects.forEach(e => {
        if (e.effect.global || e.bodyPart === effectComponent.bodyPart) {
          if (e.effect.type === 'defend') {
            defensiveEffects.push(e.effect)
          }
        }
      })

      const defense = defensiveEffects.reduce((a, b) => a + b.value! * (b.negated ? -1 : 1), 0)
      effectComponent.effect.value = Math.max(0, effect.value! - defense)

      log.effectApplied(world, effectComponent)
      damageBodyPart(world, effectComponent.source, effectComponent.target, stats, effectComponent.bodyPart!, effectComponent.effect.value!)
    }
  }

  public applyHeal(world: TlbWorld, effectComponent: EffectComponent) {
    const stats = world.getComponent<CharacterStatsComponent>(effectComponent.target, 'character-stats')
    const { effect } = effectComponent

    if (stats !== undefined) {
      healBodyPart(stats, effectComponent.bodyPart!, effect.value!)
      const log: Log = world.getResource<LogResource>('log')
      log.effectApplied(world, effectComponent)
    }
  }

  public applyStatusEffect(world: TlbWorld, effectComponent: EffectComponent) {
    const activeEffects = world.getComponent<ActiveEffectsComponent>(effectComponent.target, 'active-effects')!
    activeEffects.effects.push({ effect: effectComponent.effect, bodyPart: effectComponent.bodyPart })
  }
}
