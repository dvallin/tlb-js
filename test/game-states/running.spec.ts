import { Running } from '../../src/game-states/running'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerSystems, registerComponents, registerResources } from '../../src/tlb'
import { Vector } from '../../src/spatial'
import { mockRenderer, mockRayCaster } from '../mocks'

describe('Running', () => {
  let world: TlbWorld
  beforeEach(() => {
    world = new World()
    registerResources(world, mockRenderer())
    registerSystems(world, mockRayCaster(), jest.fn())
    registerComponents(world)
  })

  it('is frame locked', () => {
    expect(new Running().isFrameLocked()).toBeTruthy()
  })

  it('is never done', () => {
    expect(new Running().isDone(world)).toBeFalsy()
  })

  describe('start', () => {
    beforeEach(() => {})

    it('starts systems', () => {
      new Running().start(world)

      expect(world.activeSystems).toContain('free-mode-control')
    })

    it('creates viewport anchored as free mode', () => {
      new Running().start(world)

      expect(world.entityCount).toBe(1)
      expect(world.getComponent(0, 'free-mode-anchor')).toBeDefined()
      expect(world.getComponent(0, 'viewport-focus')).toBeDefined()
      expect(world.getComponent(0, 'position')).toEqual({
        position: new Vector(20, 20),
      })
    })

    it('creates player if spawn points exist', () => {
      world
        .createEntity()
        .withComponent('spawn', {})
        .withComponent('position', { position: new Vector(1, 2) })

      new Running().start(world)

      expect(world.entityCount).toBe(2)
      expect(world.getComponent(1, 'player')).toBeDefined()
      expect(world.getComponent(1, 'viewport-focus')).toBeDefined()
      expect(world.getComponent(1, 'position')).toEqual({
        position: new Vector(1, 2),
      })
    })
  })

  describe('stop', () => {
    beforeEach(() => {
      const state = new Running()
      state.start(world)
      state.stop(world)
    })

    it('stops systems', () => {
      expect(world.activeSystems).not.toContain('free-mode-control')
      expect(world.activeSystems).not.toContain('viewport-focus')
    })
  })
})
