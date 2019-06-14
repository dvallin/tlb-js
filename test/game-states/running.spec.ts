import { Running } from '../../src/game-states/running'
import { World } from '../../src/ecs/world'
import { TlbWorld } from '../../src/tlb'
import { mockComponent, mockReturnValue, mockImplementation } from '../mocks'
import { Storage } from '../../src/ecs/storage'
import { Entity } from '../../src/ecs/entity'

describe('Running', () => {
  let world: TlbWorld
  let viewportFocus: Storage<{}>
  let spawn: Storage<{}>
  beforeEach(() => {
    world = new World()
    viewportFocus = mockComponent(world, 'viewport-focus')
    spawn = mockComponent(world, 'spawn')
    mockComponent(world, 'free-mode-anchor')
    mockComponent(world, 'player')
    mockComponent(world, 'position')
  })

  it('is frame locked', () => {
    expect(new Running().isFrameLocked()).toBeTruthy()
  })

  it('is never done', () => {
    expect(new Running().isDone(world)).toBeFalsy()
  })

  describe('start', () => {
    let running: Running
    beforeEach(() => {
      running = new Running()
      running.createUILayer = jest.fn()
      running.spawnPlayer = jest.fn()
      running.setupAnchor = jest.fn()
    })

    it('starts systems', () => {
      running.start(world)

      expect(world.activeSystems).toContain('free-mode-control')
    })

    it('creates viewport anchored as free mode', () => {
      mockReturnValue(viewportFocus.size, 0)
      mockReturnValue(spawn.size, 0)

      running.start(world)

      expect(running.setupAnchor).toHaveBeenCalled()
    })

    it('creates player if spawn points exist', () => {
      mockReturnValue(viewportFocus.size, 0)
      mockReturnValue(spawn.size, 1)
      mockImplementation(spawn.foreach, (f: (entity: Entity) => void) => f(42))

      running.start(world)

      expect(running.spawnPlayer).toHaveBeenCalled()
    })
  })
})
