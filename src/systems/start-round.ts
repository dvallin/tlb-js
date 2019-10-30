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

    let totalLegs = 0
    let arms = 0
    let legs = 0
    Object.keys(stats.current.bodyParts).forEach(key => {
      const bodyPart = stats.current.bodyParts[key]
      switch (bodyPart.type) {
        case 'leg':
          totalLegs++
          if (bodyPart.health > 0) {
            legs++
          }
          break
        case 'arm':
          if (bodyPart.health > 0) {
            arms++
          }
          break
      }
    })

    stats.current.aim = canAim ? characterStats[stats.type].aim : 0

    let movementOverride: number | undefined
    if (legs === 0) {
      // put your arms to good use then
      movementOverride = arms > 0 ? 1 : 0
    } else if (legs < totalLegs) {
      // loosing legs does not make you faster
      movementOverride = Math.ceil(stats.current.movement / 2)
    }
    if (!canMove) {
      movementOverride = 0
    }

    let actionOverride: number | undefined
    if (arms === 0) {
      // use your teeth, i guess?
      actionOverride = 1
    }
    if (!canAttack) {
      actionOverride = 0
    }

    world
      .editEntity(entity)
      .removeComponent('start-turn')
      .withComponent<TakeTurnComponent>('take-turn', {
        movements: movementOverride !== undefined ? movementOverride : stats.current.movement,
        actions: actionOverride !== undefined ? actionOverride : stats.current.actions,
      })
  }
}
