import { Running } from '../../src/game-states/running'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerSystems, registerComponents } from '../../src/tlb'
import { Vector } from '../../src/spatial'

describe('Running', () => {
  let world: TlbWorld
  beforeEach(() => {
    world = new World()
    registerSystems(world)
    registerComponents(world)
  })

  it('is frame locked', () => {
    expect(new Running().isFrameLocked()).toBeTruthy()
  })

  it('is never done', () => {
    expect(new Running().isDone(world)).toBeFalsy()
  })

  describe('start', () => {
    beforeEach(() => {
      new Running().start(world)
    })

    it('starts systems', () => {
      expect(world.activeSystems).toContain('free-mode-control')
      expect(world.activeSystems).toContain('viewport-focus')
    })

    it('creates viewport anchored as free mode', () => {
      expect(world.entityCount).toBe(1)
      expect(world.getComponent(0, 'free-mode-anchor')).toBeDefined()
      expect(world.getComponent(0, 'viewport-focus')).toBeDefined()
      expect(world.getComponent(0, 'position')).toEqual({
        position: new Vector(20, 20),
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
