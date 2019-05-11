import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { EffectComponent, StatusEffectComponent, status } from '../components/effects'
import { Entity } from '../ecs/entity'
import { CharacterStatsComponent, characterStats } from '../components/character-stats'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { PositionComponent } from '../components/position'

export class Effect implements TlbSystem {
  public readonly components: ComponentName[] = ['effect']

  public update(world: TlbWorld, entity: Entity): void {
    const effect = world.getComponent<EffectComponent>(entity, 'effect')!
    switch (effect.effect) {
      case 'damage':
        this.applyDamage(world, effect)
        break
      case 'heal':
        this.applyHeal(world, effect)
        break
      case 'confuse':
        this.applyStatusEffect(world, effect, 'confused')
        break
      case 'stun':
        this.applyStatusEffect(world, effect, 'stunned')
        break
    }
    world.deleteEntity(entity)
  }

  public applyDamage(world: TlbWorld, effect: EffectComponent) {
    const stats = world.getComponent<CharacterStatsComponent>(effect.target, 'character-stats')

    if (stats !== undefined) {
      console.log(`${effect.source} hits ${effect.target}'s ${effect.bodyPart} with ${effect.value} damage`)

      const bodyPart = stats.current.bodyParts[effect.bodyPart!]
      bodyPart.health -= effect.value!

      if (bodyPart.health <= 0) {
        const isLethal = bodyPart.kind === 'torso' || bodyPart.kind === 'head'
        if (isLethal) {
          console.log(`${effect.target} died`)
          this.kill(world, effect.target)
        }
      }
    }
  }

  public applyHeal(world: TlbWorld, effect: EffectComponent) {
    const stats = world.getComponent<CharacterStatsComponent>(effect.target, 'character-stats')

    if (stats !== undefined) {
      const bodyPart = stats.current.bodyParts[effect.bodyPart!]
      bodyPart.health = Math.max(bodyPart.health + effect.value!, characterStats[stats.type].bodyParts[effect.bodyPart!].health)

      console.log(`${effect.target} heals ${effect.value}'s ${effect.bodyPart} to ${bodyPart.health}`)
    }
  }

  public applyStatusEffect(world: TlbWorld, effect: EffectComponent, status: status) {
    const statusEffects = world.getComponent<StatusEffectComponent>(effect.target, 'status-effect')
    if (statusEffects !== undefined) {
      statusEffects.activeEffects.push({ status, duration: effect.duration || 1 })
    }
  }

  public kill(world: TlbWorld, entity: Entity) {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    map.removeCharacter(position.position)
    world.deleteEntity(entity)
  }
}
