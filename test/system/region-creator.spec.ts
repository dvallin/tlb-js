import { RegionCreator } from '../../src/systems/region-creator'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'

import { mockRandom, mockMap } from '../mocks'
import { RegionComponent } from '../../src/components/region'
import { Rectangle } from '../../src/geometry/rectangle'
import { MapStorage } from '../../src/ecs/storage'
import { PositionComponent } from '../../src/components/position'
import { AgentComponent } from '../../src/components/agent'
import { WorldMap } from '../../src/resources/world-map'
import { Landmark } from '../../src/assets/landmarks'
import { Vector } from '../../src/spatial'
import { FeatureType } from '../../src/components/feature'

const mockCreateFeature = jest.fn()
jest.mock('../../src/components/feature', () => ({
  createFeature: (world: TlbWorld, map: WorldMap, pos: Vector, type: FeatureType) => mockCreateFeature(world, map, pos, type),
}))

describe('RegionCreator', () => {
  let regionCreator: RegionCreator
  let world: TlbWorld
  let map: WorldMap
  beforeEach(() => {
    jest.resetAllMocks()

    regionCreator = new RegionCreator(mockRandom())
    world = new World()
    map = mockMap(world)
    world.registerComponentStorage('region', new MapStorage<RegionComponent>())
    world.registerComponentStorage('agent', new MapStorage<AgentComponent>())
    world.registerComponentStorage('position', new MapStorage<PositionComponent>())
    world.registerComponentStorage('active', new MapStorage<{}>())
  })

  describe('buildCentralLandmark', () => {
    let landmark: Landmark
    beforeEach(() => {
      regionCreator.random.pick = jest.fn().mockImplementation(a => a[0])
      const region: RegionComponent = { shape: new Rectangle(0, 0, 20, 20), landmarks: [] }
      landmark = regionCreator.buildCentralLandmark(world, 42, region)
    })

    it('builds a landmark at the center with four entries', () => {
      expect(landmark.shape).toEqual(new Rectangle(6, 6, 7, 7))
      expect(landmark.entries).toHaveLength(4)
      expect(landmark.assets).toHaveLength(0)
    })

    it('spawns an agent at each entry', () => {
      expect(world.getComponent<AgentComponent>(0, 'agent')!.direction).toEqual('up')
      expect(world.getComponent(0, 'position')).toEqual({ position: new Vector(9, 5) })

      expect(world.getComponent<AgentComponent>(1, 'agent')!.direction).toEqual('left')
      expect(world.getComponent(1, 'position')).toEqual({ position: new Vector(5, 9) })

      expect(world.getComponent<AgentComponent>(2, 'agent')!.direction).toEqual('right')
      expect(world.getComponent(2, 'position')).toEqual({ position: new Vector(13, 9) })

      expect(world.getComponent<AgentComponent>(3, 'agent')!.direction).toEqual('down')
      expect(world.getComponent(3, 'position')).toEqual({ position: new Vector(10, 13) })
    })

    it('renders the landmark', () => {
      let c = 0
      landmark.shape.foreach(p => {
        expect(mockCreateFeature).toHaveBeenCalledWith(world, map, p, 'hub')
        c++
      })
      expect(mockCreateFeature).toHaveBeenCalledTimes(c)
    })
  })

  describe('buildLeftLandmark', () => {
    let landmark: Landmark
    beforeEach(() => {
      regionCreator.random.pick = jest.fn().mockImplementation(a => a[0])
      const region: RegionComponent = { shape: new Rectangle(0, 0, 20, 20), landmarks: [] }
      landmark = regionCreator.buildLeftLandmark(world, 42, region)
    })

    it('builds a landmark left of the region ', () => {
      expect(landmark.shape).toEqual(new Rectangle(16, 6, 7, 7))
      expect(landmark.entries).toHaveLength(2)
      expect(landmark.assets).toHaveLength(0)
    })

    it('spawns a new region', () => {
      expect(world.getComponent(0, 'region')).toBeDefined()
    })

    it('spawns an agent at each entry', () => {
      expect(world.getComponent<AgentComponent>(1, 'agent')!.direction).toEqual('left')
      expect(world.getComponent<AgentComponent>(1, 'agent')!.allowedRegion).toEqual(42)
      expect(world.getComponent(1, 'position')).toEqual({ position: new Vector(15, 9) })

      expect(world.getComponent<AgentComponent>(2, 'agent')!.direction).toEqual('right')
      expect(world.getComponent<AgentComponent>(2, 'agent')!.allowedRegion).toEqual(0)
      expect(world.getComponent(2, 'position')).toEqual({ position: new Vector(23, 9) })
    })

    it('renders the landmark', () => {
      let c = 0
      landmark.shape.foreach(p => {
        expect(mockCreateFeature).toHaveBeenCalledWith(world, map, p, 'hub')
        c++
      })
      expect(mockCreateFeature).toHaveBeenCalledTimes(c)
    })
  })
})
