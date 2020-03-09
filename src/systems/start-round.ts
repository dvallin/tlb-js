import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { CharacterStatsComponent } from '../components/character-stats'
import { ActiveEffectsComponent } from '../components/effects'
import { damageBodyPart } from '../component-reducers/damage-bodypart'
import { TakeTurnComponent } from '../components/rounds'
import { characterStats } from '../assets/characters'

export class StartRound implements TlbSystem {
  public readonly components: ComponentName[] = ['start-turn']

  public update(world: TlbWorld, entity: Entity): void {
    const stats = world.getComponent<CharacterStatsComponent>(entity, 'character-stats')!

    const activeEffects = world.getComponent<ActiveEffectsComponent>(entity, 'active-effects')!

    activeEffects.effects = activeEffects.effects.filter(e => e.effect.duration === undefined || e.effect.duration > 0)

    let canAim = true
    let canMove = true
    let canAttack = true
    activeEffects.effects.forEach(effect => {
      switch (effect.effect.type) {
        case 'bleed':
          damageBodyPart(world, entity, entity, stats, effect.bodyPart!, 1)
          break
        case 'confuse':
          canAim = false
          break
        case 'immobilize':
          canMove = false
          break
        case 'stun':
          canMove = false
          canAttack = false
          break
      }
      if (effect.effect.duration !== undefined) {
        effect.effect.duration -= 1
      }
    })

    stats.current.aim = canAim ? characterStats[stats.type].aim : 0

    world
      .editEntity(entity)
      .removeComponent('start-turn')
      .withComponent<TakeTurnComponent>('take-turn', {
        moved: !canMove,
        acted: !canAttack,
        selectionState: undefined,
      })
  }
}
