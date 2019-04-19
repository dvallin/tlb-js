import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { EffectComponent } from '../components/effects'
import { Entity } from '../ecs/entity'
import { CharacterStatsComponent } from '../components/character-stats'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { PositionComponent } from '../components/position'

export class Effect implements TlbSystem {
  public readonly components: ComponentName[] = ['effect']

  public update(world: TlbWorld, entity: Entity): void {
    const effect = world.getComponent<EffectComponent>(entity, 'effect')!
    if (effect.damage !== undefined) {
      this.applyDamage(world, effect)
    }
    world.deleteEntity(entity)
  }

  public applyDamage(world: TlbWorld, effect: EffectComponent) {
    const stats = world.getComponent<CharacterStatsComponent>(effect.target, 'character-stats')!
    console.log(`${effect.source} hits ${effect.target} with ${effect.damage} damage`)
    const effectiveDamage = Math.max(0, effect.damage! - stats.current.defense)
    stats.current.health -= effectiveDamage
    console.log(`${effect.target} suffers ${effectiveDamage} damage, his health is down to ${stats.current.health}`)
    if (stats.current.health <= 0) {
      const position = world.getComponent<PositionComponent>(effect.target, 'position')!
      const map: WorldMap = world.getResource<WorldMapResource>('map')
      map.removeCharacter(position.position)

      world.deleteEntity(effect.target)
    }
  }
}
