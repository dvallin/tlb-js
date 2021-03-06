import { Rectangle } from '../../src/geometry/rectangle'
import { Vector } from '../../src/spatial'
import { shapeTest } from './shape.test'

describe('Rectangle', () => {
  const empty = new Rectangle(0, 0, 0, 0)
  const single = new Rectangle(0, 0, 1, 1)
  const twoByThree = new Rectangle(0, 0, 2, 3)
  const threeByTwo = new Rectangle(0, 0, 3, 2)

  shapeTest(new Rectangle(1, 1, 2, 2))

  describe('empty rectangle', () => {
    it('has correct bounds', () => {
      expect(empty.left).toBe(0)
      expect(empty.right).toBe(-1)
      expect(empty.top).toBe(0)
      expect(empty.bottom).toBe(-1)
    })

    it('has correct containment', () => {
      expect(empty.containsVector(new Vector([0, 0]))).toBeFalsy()
      expect(empty.containsVector(new Vector([1, 0]))).toBeFalsy()
      expect(empty.containsVector(new Vector([0, 1]))).toBeFalsy()
      expect(empty.containsVector(new Vector([1, 1]))).toBeFalsy()
    })

    it('iterates', () => {
      const elements: Vector[] = []
      empty.foreach(f => elements.push(f))
      expect(elements).toEqual([])
    })
  })

  describe('single cell rectangle', () => {
    it('can be created from bounds', () => {
      expect(Rectangle.fromBounds(0, 0, 0, 0)).toEqual(new Rectangle(0, 0, 1, 1))
    })

    it('has correct bounds', () => {
      expect(single.left).toBe(0)
      expect(single.right).toBe(0)
      expect(single.top).toBe(0)
      expect(single.bottom).toBe(0)
    })

    it('has correct containment', () => {
      expect(single.containsVector(new Vector([0, 0]))).toBeTruthy()
      expect(single.containsVector(new Vector([1, 0]))).toBeFalsy()
      expect(single.containsVector(new Vector([0, 1]))).toBeFalsy()
      expect(single.containsVector(new Vector([1, 1]))).toBeFalsy()
    })

    it('iterates', () => {
      const elements: Vector[] = []
      single.foreach(f => elements.push(f))
      expect(elements).toEqual([new Vector([0, 0])])
    })
  })

  describe('bounds', () => {
    it('is already its own bound', () => {
      expect(empty.bounds()).toEqual(empty)
      expect(single.bounds()).toEqual(single)
    })
  })

  describe('corners', () => {
    it('returns topLeft', () => {
      expect(empty.topLeft).toEqual(new Vector([0, 0]))
      expect(single.topLeft).toEqual(new Vector([0, 0]))
      expect(twoByThree.topLeft).toEqual(new Vector([0, 0]))
    })

    it('returns topRight', () => {
      expect(empty.topRight).toEqual(new Vector([-1, 0]))
      expect(single.topRight).toEqual(new Vector([0, 0]))
      expect(twoByThree.topRight).toEqual(new Vector([1, 0]))
    })

    it('returns bottomLeft', () => {
      expect(empty.bottomLeft).toEqual(new Vector([0, -1]))
      expect(single.bottomLeft).toEqual(new Vector([0, 0]))
      expect(twoByThree.bottomLeft).toEqual(new Vector([0, 2]))
    })

    it('returns bottomRight', () => {
      expect(empty.bottomRight).toEqual(new Vector([-1, -1]))
      expect(single.bottomRight).toEqual(new Vector([0, 0]))
      expect(twoByThree.bottomRight).toEqual(new Vector([1, 2]))
    })
  })

  describe('centers', () => {
    it('returns center', () => {
      expect(empty.center).toEqual(new Vector([-1, -1]))
      expect(single.center).toEqual(new Vector([0, 0]))
      expect(twoByThree.center).toEqual(new Vector([0, 1]))
    })

    it('returns centerLeft', () => {
      expect(empty.centerLeft).toEqual(new Vector([0, -1]))
      expect(single.centerLeft).toEqual(new Vector([0, 0]))
      expect(twoByThree.centerLeft).toEqual(new Vector([0, 1]))
    })

    it('returns centerRight', () => {
      expect(empty.centerRight).toEqual(new Vector([-1, -1]))
      expect(single.centerRight).toEqual(new Vector([0, 0]))
      expect(twoByThree.centerRight).toEqual(new Vector([1, 1]))
    })

    it('returns centerBottom', () => {
      expect(empty.centerBottom).toEqual(new Vector([-1, -1]))
      expect(single.centerBottom).toEqual(new Vector([0, 0]))
      expect(twoByThree.centerBottom).toEqual(new Vector([0, 2]))
    })

    it('returns centerTop', () => {
      expect(empty.centerTop).toEqual(new Vector([-1, 0]))
      expect(single.centerTop).toEqual(new Vector([0, 0]))
      expect(twoByThree.centerTop).toEqual(new Vector([0, 0]))
    })
  })

  describe('all', () => {
    it('breaks when false is returned', () => {
      const large = new Rectangle(0, 0, 1000, 1000)
      const elements: Vector[] = []
      large.all(f => {
        elements.push(f)
        return false
      })
      expect(elements).toEqual([new Vector([0, 0])])
    })
  })

  describe('some', () => {
    it('breaks when true is returned', () => {
      const large = new Rectangle(0, 0, 1000, 1000)
      const elements: Vector[] = []
      large.some(f => {
        elements.push(f)
        return true
      })
      expect(elements).toEqual([new Vector([0, 0])])
    })
  })

  describe('plus', () => {
    it('adds single and empty cell', () => {
      expect(single.plus(empty)).toEqual(single)
      expect(empty.plus(single)).toEqual(single)
    })

    it('adds overlapping rectangles', () => {
      expect(new Rectangle(0, 0, 2, 2).plus(new Rectangle(1, 1, 2, 2))).toEqual(new Rectangle(0, 0, 3, 3))
    })

    it('adds non overlapping rectangles', () => {
      expect(new Rectangle(0, 0, 2, 2).plus(new Rectangle(4, 4, 2, 2))).toEqual(new Rectangle(0, 0, 6, 6))
    })
  })

  describe('translate', () => {
    it('equals identity for zero vector', () => {
      expect(single.translate(new Vector([0, 0]))).toEqual(single)
    })

    it('translates', () => {
      expect(single.translate(new Vector([1, 2]))).toEqual(new Rectangle(1, 2, 1, 1))
    })
  })

  describe('grow', () => {
    it('grows by one in all direction', () => {
      expect(empty.grow()).toEqual(new Rectangle(-1, -1, 2, 2))
      expect(single.grow()).toEqual(new Rectangle(-1, -1, 3, 3))
      expect(twoByThree.grow()).toEqual(new Rectangle(-1, -1, 4, 5))
    })
  })

  describe('shrink', () => {
    it('shrink by one in all direction', () => {
      expect(empty.shrink()).toEqual(empty)
      expect(single.shrink()).toEqual(empty)
      expect(twoByThree.shrink()).toEqual(new Rectangle(0, 1, 0, 1))
      expect(twoByThree.shrink().shrink()).toEqual(new Rectangle(0, 1, 0, 0))
      expect(threeByTwo.shrink().shrink()).toEqual(new Rectangle(1, 0, 0, 0))
    })
  })

  describe('footprint', () => {
    const position = new Vector([1, 2])

    function test(size: Vector, xPivot: Vector, yPivot: Vector) {
      expect(Rectangle.footprint(position, 'down', size)).toEqual(new Rectangle(xPivot.x, xPivot.y, size.x, size.y))
      expect(Rectangle.footprint(position, 'left', size)).toEqual(new Rectangle(yPivot.x, yPivot.y, size.y, size.x))
      expect(Rectangle.footprint(position, 'right', size)).toEqual(new Rectangle(yPivot.x, yPivot.y, size.y, size.x))
      expect(Rectangle.footprint(position, 'up', size)).toEqual(new Rectangle(xPivot.x, xPivot.y, size.x, size.y))
    }

    it('1x1', () => {
      const size = new Vector([1, 1])
      const xPivot = new Vector([1, 2])
      const yPivot = new Vector([1, 2])
      test(size, xPivot, yPivot)
    })

    it('2x1', () => {
      const size = new Vector([2, 1])
      const xPivot = new Vector([0, 2])
      const yPivot = new Vector([1, 1])
      test(size, xPivot, yPivot)
    })

    it('3x1', () => {
      const size = new Vector([3, 1])
      const xPivot = new Vector([0, 2])
      const yPivot = new Vector([1, 1])
      test(size, xPivot, yPivot)
    })

    it('1x2', () => {
      const size = new Vector([1, 2])
      const xPivot = new Vector([1, 1])
      const yPivot = new Vector([0, 2])
      test(size, xPivot, yPivot)
    })

    it('1x3', () => {
      const size = new Vector([1, 3])
      const xPivot = new Vector([1, 1])
      const yPivot = new Vector([0, 2])
      test(size, xPivot, yPivot)
    })

    it('2x2', () => {
      const size = new Vector([2, 2])
      const xPivot = new Vector([0, 1])
      const yPivot = new Vector([0, 1])
      test(size, xPivot, yPivot)
    })
  })
})
