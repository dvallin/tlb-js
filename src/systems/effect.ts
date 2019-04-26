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
    const stats = world.getComponent<CharacterStatsComponent>(effect.target, 'character-stats')!
    console.log(`${effect.source} hits ${effect.target} with ${effect.value} damage`)
    const effectiveDamage = Math.max(0, effect.value! - stats.current.defense)
    stats.current.health -= effectiveDamage
    console.log(`${effect.target} suffers ${effectiveDamage} damage, his health is down to ${stats.current.health}`)
    if (stats.current.health <= 0) {
      this.kill(world, effect.target)
    }
  }

  public applyHeal(world: TlbWorld, effect: EffectComponent) {
    const stats = world.getComponent<CharacterStatsComponent>(effect.target, 'character-stats')!
    stats.current.health = Math.max(stats.current.health + effect.value!, characterStats[stats.type].health)
    console.log(`${effect.target} heals ${effect.value} hp, his health is up to ${stats.current.health}`)
  }

  public applyStatusEffect(world: TlbWorld, effect: EffectComponent, status: status) {
    const statusEffects = world.getComponent<StatusEffectComponent>(effect.target, 'status-effect')!
    statusEffects.activeEffects.push({ status, duration: effect.duration || 1 })
  }

  public kill(world: TlbWorld, entity: Entity) {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    map.removeCharacter(position.position)
    world.deleteEntity(entity)
  }
}
