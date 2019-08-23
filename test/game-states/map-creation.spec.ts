import { MapCreation } from '../../src/game-states/map-creation'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerSystems, registerComponents, registerResources } from '../../src/tlb'
import { mockRenderer, mockQueries } from '../mocks'

describe('MapCreation', () => {
  let world: TlbWorld
  beforeEach(() => {
    world = new World()
    registerResources(world, mockRenderer())
    registerSystems(world, mockQueries(), jest.fn())
    registerComponents(world)
  })

  it('is not frame locked', () => {
    expect(new MapCreation().isFrameLocked()).toBeFalsy()
  })

  it('is done on empty world', () => {
    expect(new MapCreation().isDone(world)).toBeFalsy()
  })

  it('is not done as long as ', () => {
    expect(new MapCreation().isDone(world)).toBeFalsy()
  })

  describe('start', () => {
    let creation: MapCreation
    beforeEach(() => {
      creation = new MapCreation()
      creation.start(world)
    })

    it('it creates a region on start', () => {
      expect(world.entityCount).toBe(1)
      expect(world.getComponent(0, 'region')).toBeDefined()
      expect(world.getComponent(0, 'active')).toBeDefined()
    })

    it('starts systems', () => {
      expect(world.activeSystems).toContain('region-creator')
      expect(world.activeSystems).toContain('agent')
    })
  })
})
