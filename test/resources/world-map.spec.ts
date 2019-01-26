import { WorldMap } from '../../src/resources/world-map'
import { Vector } from '../../src/spatial/vector'

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
})
