import { Neighbourhood } from '../../src/geometry/neighbourhood'
import { Vector } from '../../src/spatial'
import { shapeTest } from './shape.test'

describe('Neighbourhood', () => {
  const empty = new Neighbourhood(0, 0, 0)
  const l1 = new Neighbourhood(0, 0, 1)

  shapeTest(l1)

  describe('empty neighbourhood', () => {
    it('has correct bounds', () => {
      expect(empty.bounds().left).toBe(0)
      expect(empty.bounds().right).toBe(0)
      expect(empty.bounds().top).toBe(0)
      expect(empty.bounds().bottom).toBe(0)
    })

    it('has correct containment', () => {
      expect(empty.containsVector(new Vector(0, 0))).toBeFalsy()
      expect(empty.containsVector(new Vector(1, 0))).toBeFalsy()
      expect(empty.containsVector(new Vector(0, 1))).toBeFalsy()
      expect(empty.containsVector(new Vector(1, 1))).toBeFalsy()
    })

    it('iterates', () => {
      const elements: Vector[] = []
      empty.foreach(f => elements.push(f))
      expect(elements).toEqual([])
    })
  })

  describe('default L1 neighbourhood', () => {
    it('can be constructed from helper method', () => {
      expect(Neighbourhood.L1(new Vector(0, 0))).toEqual(l1)
    })

    it('has correct bounds', () => {
      expect(l1.bounds().left).toBe(-1)
      expect(l1.bounds().right).toBe(1)
      expect(l1.bounds().top).toBe(-1)
      expect(l1.bounds().bottom).toBe(1)
    })

    it('has correct containment', () => {
      expect(l1.containsVector(new Vector(0, 0))).toBeFalsy()
      expect(l1.containsVector(new Vector(1, 0))).toBeTruthy()
      expect(l1.containsVector(new Vector(0, 1))).toBeTruthy()
      expect(l1.containsVector(new Vector(1, 1))).toBeTruthy()
    })

    it('iterates', () => {
      const elements: Vector[] = []
      l1.foreach(f => elements.push(f))
      expect(elements).toEqual([
        new Vector(-1, -1),
        new Vector(0, -1),
        new Vector(1, -1),
        new Vector(-1, 0),
        new Vector(1, 0),
        new Vector(-1, 1),
        new Vector(0, 1),
        new Vector(1, 1),
      ])
    })

    describe('translate', () => {
      it('equals identity for zero vector', () => {
        expect(l1.translate(new Vector(0, 0))).toEqual(l1)
      })

      it('translates', () => {
        expect(l1.translate(new Vector(1, 2))).toEqual(new Neighbourhood(1, 2, 1))
      })
    })

    describe('grow', () => {
      it('grows by one in all direction', () => {
        expect(empty.grow()).toEqual(new Neighbourhood(0, 0, 1))
        expect(l1.grow()).toEqual(new Neighbourhood(0, 0, 2))
      })
    })
  })

  describe('all', () => {
    it('breaks when false is returned', () => {
      const large = new Neighbourhood(0, 0, 1000)
      const elements: Vector[] = []
      large.all(f => {
        elements.push(f)
        return false
      })
      expect(elements).toEqual([new Vector(-1000, -1000)])
    })
  })
})
