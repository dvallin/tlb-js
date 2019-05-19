import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { EffectComponent, ActiveEffectsComponent, Effect } from '../components/effects'
import { Entity } from '../ecs/entity'
import { CharacterStatsComponent, characterStats } from '../components/character-stats'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { PositionComponent } from '../components/position'
import { LogResource, Log } from '../resources/log'
import { EquipedItemsComponent, ItemComponent, items } from '../components/items'

export class ApplyEffects implements TlbSystem {
  public readonly components: ComponentName[] = ['effect']

  public update(world: TlbWorld, entity: Entity): void {
    const effectComponent = world.getComponent<EffectComponent>(entity, 'effect')!
    console.log(effectComponent)
    switch (effectComponent.effect.type) {
      case 'damage':
        if (effectComponent.effect.negated) {
          this.applyHeal(world, effectComponent)
        } else {
          this.applyDamage(world, effectComponent)
        }
        break
      case 'confuse':
        this.applyStatusEffect(world, effectComponent)
        break
      case 'stun':
        this.applyStatusEffect(world, effectComponent)
        break
      case 'kill':
        this.kill(world, effectComponent.target)
        break
    }
    world.deleteEntity(entity)
  }

  public applyDamage(world: TlbWorld, effectComponent: EffectComponent) {
    const stats = world.getComponent<CharacterStatsComponent>(effectComponent.target, 'character-stats')
    const { effect } = effectComponent

    if (stats !== undefined) {
      const log: Log = world.getResource<LogResource>('log')
      log.effectApplied(world, effectComponent)

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

      const defense = defensiveEffects.reduce((a, b) => a + b.value! * (b.negated ? -1 : 1), 0)
      const effectiveDamage = Math.max(0, effect.value! - defense)

      const bodyPart = stats.current.bodyParts[effectComponent.bodyPart]
      bodyPart.health = Math.max(0, bodyPart.health - effectiveDamage)

      if (bodyPart.health === 0) {
        const isLethal = bodyPart.type === 'torso' || bodyPart.type === 'head'
        if (isLethal) {
          this.kill(world, effectComponent.target)
        } else {
          world.createEntity().withComponent<EffectComponent>('effect', {
            effect: {
              type: 'bleed',
              negated: false,
              global: false,
            },
            bodyPart: 'torso',
            source: effectComponent.source,
            target: effectComponent.target,
          })
        }
      }
    }
  }

  public applyHeal(world: TlbWorld, effectComponent: EffectComponent) {
    const stats = world.getComponent<CharacterStatsComponent>(effectComponent.target, 'character-stats')
    const { effect } = effectComponent

    if (stats !== undefined) {
      const bodyPart = stats.current.bodyParts[effectComponent.bodyPart]
      const maximum = characterStats[stats.type].bodyParts[effectComponent.bodyPart]
      bodyPart.health = Math.max(bodyPart.health + effect.value!, maximum.health)

      const log: Log = world.getResource<LogResource>('log')
      log.effectApplied(world, effectComponent)
    }
  }

  public applyStatusEffect(world: TlbWorld, effectComponent: EffectComponent) {
    const activeEffects = world.getComponent<ActiveEffectsComponent>(effectComponent.target, 'active-effects')
    if (activeEffects !== undefined) {
      activeEffects.effects.push(effectComponent.effect)
    }
  }

  public kill(world: TlbWorld, entity: Entity) {
    if (world.hasComponent(entity, 'position')) {
      const position = world.getComponent<PositionComponent>(entity, 'position')!
      const map: WorldMap = world.getResource<WorldMapResource>('map')
      map.removeCharacter(position.position)

      world
        .editEntity(entity)
        .removeComponent('position')
        .removeComponent('take-turn')
        .removeComponent('took-turn')
        .removeComponent('wait-turn')

      const log: Log = world.getResource<LogResource>('log')
      log.died(world, entity)
    }
  }
}
