import { WorldMap, WorldMapResource } from '../../src/resources/world-map'
import { Vector } from '../../src/spatial/vector'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { createFeature, FeatureComponent } from '../../src/components/feature'
import { MapStorage } from '../../src/ecs/storage'
import { PositionComponent } from '../../src/components/position'
import { Rectangle } from '../../src/geometry/rectangle'
import { Difference } from '../../src/geometry/difference'
import { features } from '../../src/assets/features'

describe('WorldMap', () => {
  describe('tile based queries', () => {
    let map: WorldMap
    let world: TlbWorld
    beforeEach(() => {
      map = new WorldMapResource(10)
      world = new World()

      world.registerComponentStorage('position', new MapStorage<PositionComponent>())
      world.registerComponentStorage('feature', new MapStorage<FeatureComponent>())
      createFeature(world, map, 0, new Vector([1, 0]), () => features['locker'])
      createFeature(world, map, 0, new Vector([1, 1]), () => features['corridor'])
    })

    describe('tileMatches', () => {
      it('calls predicate with missing feature', () => {
        const predicate = jest.fn()
        map.levels[0].tileMatches(world, new Vector([0, 0]), predicate)
        expect(predicate).toHaveBeenCalledWith(undefined)
      })
    })

    describe('isBlocking', () => {
      it('missing tile is blocking', () => {
        expect(map.levels[0].isBlocking(world, new Vector([0, 0]))).toBeTruthy()
      })

      it('blocking tile blocks', () => {
        expect(map.levels[0].isBlocking(world, new Vector([1, 0]))).toBeTruthy()
      })

      it('non-blocking tile does not block', () => {
        expect(map.levels[0].isBlocking(world, new Vector([1, 1]))).toBeFalsy()
      })
    })

    describe('isShapeFree', () => {
      it('not free if feature present', () => {
        expect(map.levels[0].isShapeFree(world, new Rectangle(0, 0, 2, 2))).toBeFalsy()
      })

      it('free if no feature is present', () => {
        expect(map.levels[0].isShapeFree(world, new Difference(new Rectangle(0, 0, 2, 2), new Rectangle(1, 0, 2, 2)))).toBeTruthy()
      })
    })

    describe('shapeHasAll', () => {
      it('calls while true', () => {
        map.levels[0].tileMatches = jest.fn().mockReturnValue(true)
        map.levels[0].shapeHasAll(world, new Rectangle(0, 0, 2, 2), jest.fn())
        expect(map.levels[0].tileMatches).toHaveBeenCalledTimes(4)
      })

      it('stops once false', () => {
        map.levels[0].tileMatches = jest.fn().mockReturnValue(false)
        map.levels[0].shapeHasAll(world, new Rectangle(0, 0, 2, 2), jest.fn())
        expect(map.levels[0].tileMatches).toHaveBeenCalledTimes(1)
      })
    })

    describe('shapeHasSome', () => {
      it('calls until true', () => {
        map.levels[0].tileMatches = jest.fn().mockReturnValue(false)
        map.levels[0].shapeHasSome(world, new Rectangle(0, 0, 2, 2), jest.fn())
        expect(map.levels[0].tileMatches).toHaveBeenCalledTimes(4)
      })

      it('stops once true', () => {
        map.levels[0].tileMatches = jest.fn().mockReturnValue(true)
        map.levels[0].shapeHasSome(world, new Rectangle(0, 0, 2, 2), jest.fn())
        expect(map.levels[0].tileMatches).toHaveBeenCalledTimes(1)
      })
    })
  })
})
