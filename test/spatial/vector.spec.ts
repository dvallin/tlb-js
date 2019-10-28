import { Vector } from '../../src/spatial/vector'

describe('Vector', () => {
  it('renders a key value', () => {
    const v = new Vector([1, 2])
    expect(v.key).toEqual('1,2')
  })

  it('allows access', () => {
    const v = new Vector([1, 2])
    expect(v.x).toBe(1)
    expect(v.y).toBe(2)
  })

  describe('add', () => {
    it('adds equal sized vectors', () => {
      expect(new Vector([1, 2]).add(new Vector([2, 1]))).toEqual(new Vector([3, 3]))
    })
  })

  describe('minus', () => {
    it('substracts equal sized vectors', () => {
      expect(new Vector([1, 2]).minus(new Vector([2, 1]))).toEqual(new Vector([-1, 1]))
    })
  })

  describe('bounds', () => {
    it('checks the bounding', () => {
      expect(new Vector([0, 0]).bounds(new Vector([0, 0]))).toBeFalsy()
      expect(new Vector([1, 1]).bounds(new Vector([0, 0]))).toBeTruthy()
      expect(new Vector([-2, 2]).bounds(new Vector([-1, 1]))).toBeTruthy()
    })
  })

  describe('abs', () => {
    it('calculates absolute values', () => {
      expect(new Vector([1, 1]).abs()).toEqual(new Vector([1, 1]))
      expect(new Vector([-2, 2]).abs()).toEqual(new Vector([2, 2]))
    })
  })

  describe('floor', () => {
    it('rounds down', () => {
      expect(new Vector([1, 1.9]).fX).toEqual(1)
      expect(new Vector([1, 1.9]).fY).toEqual(1)
      expect(new Vector([-2, -2.9]).fX).toEqual(-2)
      expect(new Vector([-2, -2.9]).fY).toEqual(-3)
    })
  })

  describe('mult', () => {
    it('multiplies by scalar', () => {
      expect(new Vector([1, 1]).mult(-1)).toEqual(new Vector([-1, -1]))
      expect(new Vector([-2, 2]).mult(0)).toEqual(new Vector([-0, 0]))
    })
  })

  describe('interpolate', () => {
    it('returns the extremal points', () => {
      expect(Vector.interpolate(new Vector([1, 2]), new Vector([3, 4]), 0)).toEqual(new Vector([1, 2]))
      expect(Vector.interpolate(new Vector([1, 2]), new Vector([3, 4]), 1)).toEqual(new Vector([3, 4]))
    })

    it('returns internal points', () => {
      expect(Vector.interpolate(new Vector([1, 2]), new Vector([3, 4]), 0.5)).toEqual(new Vector([2, 3]))
      expect(Vector.interpolate(new Vector([1, 2]), new Vector([3, 4]), 0.75)).toEqual(new Vector([2.5, 3.5]))
    })

    it('returns external points', () => {
      expect(Vector.interpolate(new Vector([1, 2]), new Vector([3, 4]), 1.5)).toEqual(new Vector([4, 5]))
      expect(Vector.interpolate(new Vector([1, 2]), new Vector([3, 4]), -0.5)).toEqual(new Vector([0, 1]))
    })
  })

  describe('perpendicular', () => {
    it('calculates perpendicular vector', () => {
      expect(new Vector([1, 2]).perpendicular()).toEqual(new Vector([-2, 1]))
    })
  })
})
