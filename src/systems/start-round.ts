import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { Random } from '../random'
import { CharacterStatsComponent, characterStats } from '../components/character-stats'
import { ActiveEffectsComponent } from '../components/effects'
import { damageBodyPart } from '../component-reducers/damage-bodypart'
import { TakeTurnComponent } from '../components/rounds'

export class StartRound implements TlbSystem {
  public readonly components: ComponentName[] = ['start-turn', 'position']

  public constructor(public readonly random: Random) {}

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
          damageBodyPart(world, entity, entity, stats, effect.bodyPart, 1)
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

    let totalArms = 0
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
          totalArms++
          if (bodyPart.health > 0) {
            arms++
          }
          break
      }
    })

    let movementMultiplier
    if (legs > 0) {
      movementMultiplier = legs / totalLegs
    } else {
      movementMultiplier = arms / totalArms / 3
    }

    let actionMultiplier = arms > 0 ? 1.0 : 0.3

    stats.current.aim = canAim ? characterStats[stats.type].aim : 0

    if (!canMove) {
      movementMultiplier = 0
    }

    if (!canAttack) {
      actionMultiplier = 0
    }

    world
      .editEntity(entity)
      .removeComponent('start-turn')
      .withComponent<TakeTurnComponent>('take-turn', {
        movements: Math.ceil(movementMultiplier * stats.current.movement),
        actions: Math.ceil(actionMultiplier * stats.current.actions),
      })
  }
}
