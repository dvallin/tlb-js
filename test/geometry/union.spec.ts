import { Union } from '../../src/geometry/union'
import { Rectangle } from '../../src/geometry/rectangle'
import { Vector } from '../../src/spatial'
import { shapeTest } from './shape.test'

describe('Union', () => {
  shapeTest(new Union(new Rectangle(1, 1, 2, 2), new Rectangle(3, 3, 1, 1)))

  describe('simple union', () => {
    const shape1 = new Rectangle(0, 0, 1, 1)
    const shape2 = new Rectangle(2, 2, 1, 1)
    const union = new Union(shape1, shape2)

    it('has bounds enclosing both shapes', () => {
      expect(union.bounds()).toEqual(new Rectangle(0, 0, 3, 3))
    })

    it('grows shapes individually', () => {
      expect(union.grow()).toEqual(new Union(shape1.grow(), shape2.grow()))
    })

    it('shrinks shapes individually', () => {
      expect(union.shrink()).toEqual(new Union(shape1.shrink(), shape2.shrink()))
    })

    it('iterates', () => {
      const elements: Vector[] = []
      union.foreach(f => elements.push(f))
      expect(elements).toEqual([new Vector([0, 0]), new Vector([2, 2])])
    })

    describe('translate', () => {
      it('equals identity for zero vector', () => {
        expect(union.translate(new Vector([0, 0]))).toEqual(union)
      })

      it('translates', () => {
        expect(union.translate(new Vector([1, 2]))).toEqual(new Union(new Rectangle(1, 2, 1, 1), new Rectangle(3, 4, 1, 1)))
      })
    })
  })
})
