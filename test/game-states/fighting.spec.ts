import { Fighting } from '../../src/game-states/fighting'
import { TlbWorld, registerComponents } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { characterCreators } from '../../src/assets/characters'
import { Entity } from '../../src/ecs/entity'
import { mockViewport } from '../mocks'
import { Viewport } from '../../src/resources/viewport'
import { ActiveEffectsComponent, bleed } from '../../src/components/effects'
import { WorldMapResource } from '../../src/resources/world-map'

describe('Fighting', () => {
  let world: TlbWorld
  let player: Entity
  let viewport: Viewport
  let state: Fighting
  beforeEach(() => {
    world = new World()
    world.registerResource(new WorldMapResource(2))
    registerComponents(world)

    viewport = mockViewport(world)
    viewport.gridLocked = false

    player = characterCreators.player(world)

    state = new Fighting()
  })

  describe('start', () => {
    it('starts with player', () => {
      state.start(world)
      expect(world.hasComponent(player, 'start-turn')).toBeTruthy()
    })

    it('activates grid mode', () => {
      state.start(world)
      expect(viewport.gridLocked).toBeTruthy()
    })
  })

  describe('stop', () => {
    it('resets grid mode', () => {
      state.start(world)
      state.stop(world)
      expect(viewport.gridLocked).toBeFalsy()
    })
  })

  describe('update', () => {
    it('activates next entity', () => {
      world.editEntity(player).withComponent('wait-turn', {})
      state.update(world)
      expect(world.hasComponent(player, 'start-turn')).toBeTruthy()
    })

    it('starts new round', () => {
      world.editEntity(player).withComponent('took-turn', {})
      state.update(world)
      expect(world.hasComponent(player, 'start-turn')).toBeTruthy()
    })
  })

  describe('isDone', () => {
    it('is done if noone is fighting', () => {
      expect(state.isDone(world)).toBeTruthy()
    })

    it('is done if only player is fighting', () => {
      world.editEntity(player).withComponent('took-turn', {})
      expect(state.isDone(world)).toBeTruthy()
    })

    it('is not done if there are enemies', () => {
      const guard = characterCreators.guard(world)
      world.editEntity(guard).withComponent('wait-turn', {})
      world.editEntity(player).withComponent('took-turn', {})
      expect(state.isDone(world)).toBeFalsy()
    })

    it('is done if player is dead', () => {
      const guard = characterCreators.guard(world)
      world.editEntity(guard).withComponent('wait-turn', {})
      world
        .editEntity(player)
        .withComponent('took-turn', {})
        .withComponent('dead', {})
      expect(state.isDone(world)).toBeTruthy()
    })

    it('is not done if player is struggling', () => {
      world
        .editEntity(player)
        .withComponent('took-turn', {})
        .withComponent<ActiveEffectsComponent>('active-effects', { effects: [{ effect: bleed() }] })
      expect(state.isDone(world)).toBeFalsy()
    })
  })
})
