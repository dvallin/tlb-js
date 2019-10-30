import { StartRound } from '../../src/systems/start-round'
import { World } from '../../src/ecs/world'
import { Entity } from '../../src/ecs/entity'
import { characterCreators, characterStats } from '../../src/assets/characters'
import { registerComponents, TlbWorld } from '../../src/tlb'
import { TakeTurnComponent } from '../../src/components/rounds'
import { ActiveEffectsComponent, immobilize, stun, confuse, bleed } from '../../src/components/effects'
import { CharacterStatsComponent } from '../../src/components/character-stats'

describe('StartRound', () => {
  let world: TlbWorld
  let player: Entity
  let system: StartRound
  beforeEach(() => {
    world = new World()
    registerComponents(world)

    player = characterCreators.player(world)
    world.editEntity(player).withComponent('start-turn', {})
    system = new StartRound()
  })

  it('starts round', () => {
    system.update(world, player)

    expect(world.hasComponent(player, 'start-turn')).toBeFalsy()
    expect(world.getComponent<TakeTurnComponent>(player, 'take-turn')).toEqual({
      actions: characterStats.player.actions,
      movements: characterStats.player.movement,
    })
  })

  describe('active effects', () => {
    it('decreases effect duration', () => {
      world.getComponent<ActiveEffectsComponent>(player, 'active-effects')!.effects.push({ effect: immobilize(1) })

      system.update(world, player)

      expect(world.getComponent<ActiveEffectsComponent>(player, 'active-effects')!.effects[0].effect.duration).toEqual(0)
    })

    it('removes old effects', () => {
      world.getComponent<ActiveEffectsComponent>(player, 'active-effects')!.effects.push({ effect: immobilize(0) })

      system.update(world, player)

      expect(world.getComponent<ActiveEffectsComponent>(player, 'active-effects')!.effects).toHaveLength(0)
      expect(world.getComponent<TakeTurnComponent>(player, 'take-turn')).toEqual({
        actions: characterStats.player.actions,
        movements: characterStats.player.movement,
      })
    })

    it('immobilizes', () => {
      world.getComponent<ActiveEffectsComponent>(player, 'active-effects')!.effects.push({ effect: immobilize(1) })

      system.update(world, player)

      expect(world.getComponent<TakeTurnComponent>(player, 'take-turn')).toEqual({
        actions: characterStats.player.actions,
        movements: 0,
      })
    })

    it('confuses', () => {
      world.getComponent<ActiveEffectsComponent>(player, 'active-effects')!.effects.push({ effect: confuse(1) })

      system.update(world, player)

      expect(world.getComponent<CharacterStatsComponent>(player, 'character-stats')!.current.aim).toEqual(0)
    })

    it('stuns', () => {
      world.getComponent<ActiveEffectsComponent>(player, 'active-effects')!.effects.push({ effect: stun(1) })

      system.update(world, player)

      expect(world.getComponent<TakeTurnComponent>(player, 'take-turn')).toEqual({
        actions: 0,
        movements: 0,
      })
    })

    it('bleeds', () => {
      world.getComponent<ActiveEffectsComponent>(player, 'active-effects')!.effects.push({ effect: bleed(), bodyPart: 'torso' })

      system.update(world, player)

      const currentHealth = world.getComponent<CharacterStatsComponent>(player, 'character-stats')!.current.bodyParts['torso'].health
      const maxHealth = characterStats.player.bodyParts['torso'].health
      expect(maxHealth - currentHealth).toEqual(1)
    })
  })

  describe('missing body parts', () => {
    it('one leg missing', () => {
      const stats = world.getComponent<CharacterStatsComponent>(player, 'character-stats')!.current
      stats.bodyParts['leftLeg'].health = 0

      system.update(world, player)

      expect(world.getComponent<TakeTurnComponent>(player, 'take-turn')).toEqual({
        movements: 2,
        actions: characterStats.player.actions,
      })
    })

    it('two legs missing', () => {
      const stats = world.getComponent<CharacterStatsComponent>(player, 'character-stats')!.current
      stats.bodyParts['leftLeg'].health = 0
      stats.bodyParts['rightLeg'].health = 0

      system.update(world, player)

      expect(world.getComponent<TakeTurnComponent>(player, 'take-turn')).toEqual({
        movements: 1,
        actions: characterStats.player.actions,
      })
    })

    it('one arm missing', () => {
      const stats = world.getComponent<CharacterStatsComponent>(player, 'character-stats')!.current
      stats.bodyParts['leftArm'].health = 0

      system.update(world, player)

      expect(world.getComponent<TakeTurnComponent>(player, 'take-turn')).toEqual({
        movements: characterStats.player.movement,
        actions: characterStats.player.actions,
      })
    })

    it('two arms missing', () => {
      const stats = world.getComponent<CharacterStatsComponent>(player, 'character-stats')!.current
      stats.bodyParts['leftArm'].health = 0
      stats.bodyParts['rightArm'].health = 0

      system.update(world, player)

      expect(world.getComponent<TakeTurnComponent>(player, 'take-turn')).toEqual({
        movements: characterStats.player.movement,
        actions: 1,
      })
    })

    it('no arms and legs', () => {
      const stats = world.getComponent<CharacterStatsComponent>(player, 'character-stats')!.current
      stats.bodyParts['leftLeg'].health = 0
      stats.bodyParts['rightLeg'].health = 0
      stats.bodyParts['leftArm'].health = 0
      stats.bodyParts['rightArm'].health = 0

      system.update(world, player)

      expect(world.getComponent<TakeTurnComponent>(player, 'take-turn')).toEqual({
        movements: 0,
        actions: 1,
      })
    })
  })
})
