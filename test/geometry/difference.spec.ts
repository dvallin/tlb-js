import { Difference } from '../../src/geometry/difference'
import { Rectangle } from '../../src/geometry/rectangle'
import { Vector } from '../../src/spatial'
import { shapeTest } from './shape.test'

describe('Difference', () => {
  shapeTest(new Difference(new Rectangle(1, 1, 2, 2), new Rectangle(3, 3, 1, 1)))

  describe('l shaped difference', () => {
    const shape1 = new Rectangle(0, 0, 2, 2)
    const shape2 = new Rectangle(1, 1, 2, 2)
    const difference = new Difference(shape1, shape2)

    it('bounds still the same', () => {
      expect(difference.bounds()).toEqual(new Rectangle(0, 0, 2, 2))
    })

    it('grows shapes individually', () => {
      expect(difference.grow()).toEqual(new Difference(shape1.grow(), shape2.grow()))
    })

    it('shrinks shapes individually', () => {
      expect(difference.shrink()).toEqual(new Difference(shape1.shrink(), shape2.shrink()))
    })

    it('iterates', () => {
      const elements: Vector[] = []
      difference.foreach(f => elements.push(f))
      expect(elements).toEqual([new Vector(0, 0), new Vector(1, 0), new Vector(0, 1)])
    })

    describe('translate', () => {
      it('equals identity for zero vector', () => {
        expect(difference.translate(new Vector(0, 0))).toEqual(difference)
      })

      it('translates', () => {
        expect(difference.translate(new Vector(1, 2))).toEqual(new Difference(new Rectangle(1, 2, 2, 2), new Rectangle(2, 3, 2, 2)))
      })
    })
  })
})
