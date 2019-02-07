import { MapCreation } from '../../src/game-states/map-creation'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerSystems, registerComponents, registerResources } from '../../src/tlb'
import { mockRenderer } from '../mocks'
import { RegionComponent } from '../../src/components/region'
import { Rectangle } from '../../src/geometry/rectangle'

describe('MapCreation', () => {
  let world: TlbWorld
  beforeEach(() => {
    world = new World()
    registerResources(world, mockRenderer())
    registerSystems(world)
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

  describe('stop', () => {
    const shape = Rectangle.fromBounds(0, 2, 0, 2)
    beforeEach(() => {
      const state = new MapCreation()
      state.start(world)
      world.getComponent<RegionComponent>(0, 'region')!.landmarks.push({
        shape,
        entries: [],
        assets: [],
      })
      state.stop(world)
    })

    it('stops systems', () => {
      expect(world.activeSystems).not.toContain('region-creator')
      expect(world.activeSystems).not.toContain('agent')
    })

    it('creates a spawn point at first landmark', () => {
      expect(world.entityCount).toBe(2)
      expect(world.getComponent(1, 'spawn')).toBeDefined()
      expect(world.getComponent(1, 'position')).toEqual({ position: shape.center })
    })
  })
})
