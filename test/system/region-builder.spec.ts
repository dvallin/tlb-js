import { RegionBuilder } from '../../src/systems/region-builder'
import { Uniform } from '../../src/random/distributions'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerComponents, registerResources } from '../../src/tlb'
import { RegionComponent } from '../../src/components/region'
import { Rectangle } from '../../src/geometry/rectangle'
import { mockRenderer } from '../mocks'
import { renderMap } from '../render'
import { Vector } from '../../src/spatial'
import { WorldMapResource } from '../../src/resources/world-map'
import { features } from '../../src/assets/features'

describe('RegionBuilder', () => {
  let world: TlbWorld
  let system: RegionBuilder
  beforeEach(() => {
    world = new World()
    registerComponents(world)
    registerResources(world, mockRenderer())
    system = new RegionBuilder(new Uniform('12'))
  })

  describe('red region', () => {
    it('creates the region', () => {
      const shape = new Rectangle(0, 0, 30, 30)
      const region = world
        .createEntity()
        .withComponent('active', {})
        .withComponent<RegionComponent>('region', {
          type: 'red',
          shape,
          level: 0,
          authorized: new Set(),
          exits: [],
        }).entity

      system.update(world, region)

      expect(world.getStorage('structure').size()).toBeGreaterThan(0)
      expect(renderMap(world, shape)).toMatchSnapshot()
    })

    it('puts corridors at exits', () => {
      const shape = new Rectangle(0, 0, 30, 30)
      const exits = [new Vector([0, 10]), new Vector([25, 29])]
      const region = world
        .createEntity()
        .withComponent('active', {})
        .withComponent<RegionComponent>('region', {
          type: 'red',
          shape,
          level: 0,
          authorized: new Set(),
          exits,
        }).entity

      system.update(world, region)

      expect(world.getStorage('structure').size()).toBeGreaterThan(0)
      expect(renderMap(world, shape)).toMatchSnapshot()

      const level = world.getResource<WorldMapResource>('map').levels[0]
      exits.forEach(e => expect(level.tileMatches(world, e, f => f!.feature() === features.corridor)).toBeTruthy())
    })
  })

  describe('elevator region', () => {
    it('creates the region', () => {
      const shape = new Rectangle(0, 0, 5, 5)
      const region = world
        .createEntity()
        .withComponent('active', {})
        .withComponent<RegionComponent>('region', {
          type: 'elevator',
          shape,
          level: 0,
          authorized: new Set(),
          exits: [],
        }).entity

      const system = new RegionBuilder(new Uniform('12'))

      system.update(world, region)

      expect(renderMap(world, shape)).toMatchSnapshot()
    })

    it('puts corridors at exits', () => {
      const shape = new Rectangle(0, 0, 5, 5)
      const exits = [new Vector([0, 2])]
      const region = world
        .createEntity()
        .withComponent('active', {})
        .withComponent<RegionComponent>('region', {
          type: 'elevator',
          shape,
          level: 0,
          authorized: new Set(),
          exits,
        }).entity

      system.update(world, region)

      expect(world.getStorage('structure').size()).toBeGreaterThan(0)
      expect(renderMap(world, shape)).toMatchSnapshot()

      const level = world.getResource<WorldMapResource>('map').levels[0]
      exits.forEach(e => expect(level.tileMatches(world, e, f => f!.feature() === features.corridor)).toBeTruthy())
    })
  })
})
