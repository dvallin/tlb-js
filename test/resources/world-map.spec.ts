import { WorldMap } from '../../src/resources/world-map'
import { Vector } from '../../src/spatial/vector'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { createFeature, FeatureComponent } from '../../src/components/feature'
import { MapStorage } from '../../src/ecs/storage'
import { PositionComponent } from '../../src/components/position'
import { Rectangle } from '../../src/geometry/rectangle'
import { Difference } from '../../src/geometry/difference'

describe('WorldMap', () => {
  describe('isValid', () => {
    it('checks that vector is in bounds', () => {
      const map = new WorldMap(new Vector(20, 20))

      expect(map.isValid(new Vector(20, 20))).toBeFalsy()
      expect(map.isValid(new Vector(-20, -20))).toBeFalsy()

      expect(map.isValid(new Vector(0, 0))).toBeTruthy()
      expect(map.isValid(new Vector(-19, 19))).toBeTruthy()
    })

    it('throws on wrong dimension', () => {
      const map = new WorldMap(new Vector(20, 20))

      expect(() => map.isValid(new Vector())).toThrowError('dimension mismatch')
      expect(() => map.isValid(new Vector(1))).toThrowError('dimension mismatch')
      expect(() => map.isValid(new Vector(1, 2, 1))).toThrowError('dimension mismatch')
    })
  })

  describe('isTileBlocking', () => {})

  describe('tile based queries', () => {
    let map: WorldMap
    let world: TlbWorld
    beforeEach(() => {
      map = new WorldMap(new Vector(2, 2))
      world = new World()

      world.registerComponentStorage('position', new MapStorage<PositionComponent>())
      world.registerComponentStorage('feature', new MapStorage<FeatureComponent>())
      createFeature(world, map, new Vector(1, 0), 'locker')
      createFeature(world, map, new Vector(1, 1), 'corridor')
    })

    describe('tileMatches', () => {
      it('calls predicate with missing feature', () => {
        const predicate = jest.fn()
        map.tileMatches(world, new Vector(0, 0), predicate)
        expect(predicate).toHaveBeenCalledWith(undefined)
      })

      it('calls predicate with feature', () => {
        const predicate = jest.fn()
        map.tileMatches(world, new Vector(1, 0), predicate)
        expect(predicate).toHaveBeenCalledWith({ type: 'locker' })
      })
    })

    describe('isTileBlocking', () => {
      it('missing tile is blocking', () => {
        expect(map.isTileBlocking(world, new Vector(0, 0))).toBeTruthy()
      })

      it('blocking tile blocks', () => {
        expect(map.isTileBlocking(world, new Vector(1, 0))).toBeTruthy()
      })

      it('non-blocking tile does not block', () => {
        expect(map.isTileBlocking(world, new Vector(1, 1))).toBeFalsy()
      })
    })

    describe('isShapeFree', () => {
      it('not free if feature present', () => {
        expect(map.isShapeFree(world, new Rectangle(0, 0, 2, 2))).toBeFalsy()
      })

      it('free if no feature is present', () => {
        expect(map.isShapeFree(world, new Difference(new Rectangle(0, 0, 2, 2), new Rectangle(1, 0, 2, 2)))).toBeTruthy()
      })
    })

    describe('shapeHasAll', () => {
      it('calls while true', () => {
        map.tileMatches = jest.fn().mockReturnValue(true)
        map.shapeHasAll(world, new Rectangle(0, 0, 2, 2), jest.fn())
        expect(map.tileMatches).toHaveBeenCalledTimes(4)
      })

      it('stops once false', () => {
        map.tileMatches = jest.fn().mockReturnValue(false)
        map.shapeHasAll(world, new Rectangle(0, 0, 2, 2), jest.fn())
        expect(map.tileMatches).toHaveBeenCalledTimes(1)
      })
    })

    describe('shapeHasSome', () => {
      it('calls until true', () => {
        map.tileMatches = jest.fn().mockReturnValue(false)
        map.shapeHasSome(world, new Rectangle(0, 0, 2, 2), jest.fn())
        expect(map.tileMatches).toHaveBeenCalledTimes(4)
      })

      it('stops once true', () => {
        map.tileMatches = jest.fn().mockReturnValue(true)
        map.shapeHasSome(world, new Rectangle(0, 0, 2, 2), jest.fn())
        expect(map.tileMatches).toHaveBeenCalledTimes(1)
      })
    })
  })
})
