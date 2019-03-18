import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { DamageComponent } from '../components/action'
import { Entity } from '../ecs/entity'
import { CharacterStatsComponent } from '../components/character-stats'

export class Damage implements TlbSystem {
  public readonly components: ComponentName[] = ['damage']

  public update(world: TlbWorld, entity: Entity): void {
    const damage = world.getComponent<DamageComponent>(entity, 'damage')!
    const stats = world.getComponent<CharacterStatsComponent>(damage.target, 'character-stats')!
    console.log(`${damage.source} hits ${damage.target} with ${damage.damage} damage`)
    const effectiveDamage = Math.max(0, damage.damage - stats.current.defense)
    stats.current.health -= effectiveDamage
    console.log(`${damage.target} suffers ${effectiveDamage} damage, his health is down to ${stats.current.health}`)
    if (stats.current.health <= 0) {
      world.deleteEntity(damage.target)
    }
    world.deleteEntity(entity)
  }
}
