import { ApplyEffects } from '../../src/systems/apply-effect'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerComponents } from '../../src/tlb'
import {
  EffectComponent,
  damage,
  ActiveEffectsComponent,
  defend,
  heal,
  immobilize,
  bleed,
  negateEffects,
  kill,
} from '../../src/components/effects'
import { characterCreators, characterStats } from '../../src/assets/characters'
import { Entity } from '../../src/ecs/entity'
import { mockLog } from '../mocks'
import { CharacterStatsComponent } from '../../src/components/character-stats'
import { WorldMapResource } from '../../src/resources/world-map'
import { Uniform } from '../../src/random/distributions'

describe('ApplyEffects', () => {
  let world: TlbWorld
  let guard: Entity
  let player: Entity
  let system: ApplyEffects
  beforeEach(() => {
    world = new World()
    registerComponents(world)
    world.registerResource(new WorldMapResource(2))
    mockLog(world)

    player = characterCreators.player(world)
    guard = characterCreators.guard(world)
    system = new ApplyEffects(new Uniform('ApplyEffects'))
  })

  describe('damage', () => {
    it('applies damage', () => {
      const effect = world
        .createEntity()
        .withComponent<EffectComponent>('effect', { effect: damage(3), source: player, target: guard, bodyParts: ['torso'] }).entity

      system.update(world, effect)

      const maxHealth = characterStats.guard.bodyParts['torso'].health
      const currentHealth = world.getComponent<CharacterStatsComponent>(guard, 'character-stats')!.current.bodyParts['torso'].health
      expect(maxHealth - currentHealth).toEqual(3)
    })

    it('respects body armor', () => {
      const effect = world
        .createEntity()
        .withComponent<EffectComponent>('effect', { effect: damage(3), source: guard, target: player, bodyParts: ['torso'] }).entity

      system.update(world, effect)

      const maxHealth = characterStats.player.bodyParts['torso'].health
      const currentHealth = world.getComponent<CharacterStatsComponent>(player, 'character-stats')!.current.bodyParts['torso'].health
      expect(maxHealth - currentHealth).toEqual(0)
    })

    it('respects active effects', () => {
      const effect = world
        .createEntity()
        .withComponent<EffectComponent>('effect', { effect: damage(3), source: player, target: guard, bodyParts: ['torso'] }).entity

      world.editEntity(guard).withComponent<ActiveEffectsComponent>('active-effects', {
        effects: [
          { effect: defend(1, 1) },
          { effect: defend(1, 1, false), bodyPart: 'torso' },
          { effect: defend(2, 1, false), bodyPart: 'head' },
        ],
      })

      system.update(world, effect)

      const maxHealth = characterStats.guard.bodyParts['torso'].health
      const currentHealth = world.getComponent<CharacterStatsComponent>(guard, 'character-stats')!.current.bodyParts['torso'].health
      expect(maxHealth - currentHealth).toEqual(1)
    })
  })

  describe('heal', () => {
    it('fully heals bodyparts', () => {
      world.getComponent<CharacterStatsComponent>(player, 'character-stats')!.current.bodyParts['torso'].health = 1

      const effect = world
        .createEntity()
        .withComponent<EffectComponent>('effect', { effect: heal(), source: player, target: player, bodyParts: ['torso'] }).entity

      system.update(world, effect)

      const maxHealth = characterStats.player.bodyParts['torso'].health
      const currentHealth = world.getComponent<CharacterStatsComponent>(player, 'character-stats')!.current.bodyParts['torso'].health
      expect(currentHealth).toEqual(maxHealth)
    })
  })

  describe('status effects', () => {
    it('applies global status effects', () => {
      const effect = world.createEntity().withComponent<EffectComponent>('effect', { effect: immobilize(2), source: player, target: guard })
        .entity

      system.update(world, effect)

      const activeEffects = world.getComponent<ActiveEffectsComponent>(guard, 'active-effects')!.effects
      expect(activeEffects).toHaveLength(1)
      expect(activeEffects[0].effect).toEqual(immobilize(2))
    })

    it('applies local status effects', () => {
      const effect = world
        .createEntity()
        .withComponent<EffectComponent>('effect', { effect: bleed(), source: player, target: guard, bodyParts: ['leftArm', 'rightArm'] })
        .entity

      system.update(world, effect)

      const activeEffects = world.getComponent<ActiveEffectsComponent>(guard, 'active-effects')!.effects
      expect(activeEffects).toHaveLength(2)
      expect(activeEffects.map(i => i.bodyPart)).toEqual(['leftArm', 'rightArm'])
      expect(activeEffects.map(i => i.effect)).toEqual([bleed(), bleed()])
    })
  })

  describe('remove all negative effects', () => {
    beforeEach(() => {
      world.editEntity(player).withComponent<ActiveEffectsComponent>('active-effects', {
        effects: [{ effect: defend(1, 1) }, { effect: bleed(), bodyPart: 'torso' }, { effect: bleed(), bodyPart: 'head' }],
      })
    })

    it('applies globally', () => {
      const effect = world
        .createEntity()
        .withComponent<EffectComponent>('effect', { effect: negateEffects(), source: player, target: player }).entity

      system.update(world, effect)

      const activeEffects = world.getComponent<ActiveEffectsComponent>(player, 'active-effects')!.effects
      expect(activeEffects).toHaveLength(1)
      expect(activeEffects[0].effect).toEqual(defend(1, 1))
    })

    it('applies locally', () => {
      const effect = world
        .createEntity()
        .withComponent<EffectComponent>('effect', { effect: negateEffects(), source: player, target: player, bodyParts: ['head'] }).entity

      system.update(world, effect)

      const activeEffects = world.getComponent<ActiveEffectsComponent>(player, 'active-effects')!.effects
      expect(activeEffects).toHaveLength(2)
      expect(activeEffects.map(e => e.bodyPart)).toEqual([undefined, 'torso'])
      expect(activeEffects.map(e => e.effect)).toEqual([defend(1, 1), bleed()])
    })
  })

  describe('kill', () => {
    it('instantly kills', () => {
      const effect = world.createEntity().withComponent<EffectComponent>('effect', { effect: kill(), source: player, target: player })
        .entity

      system.update(world, effect)

      expect(world.hasComponent(player, 'dead')).toBeTruthy()
    })
  })
})
