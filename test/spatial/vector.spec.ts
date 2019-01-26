import { Vector } from '../../src/spatial/vector'

describe('Vector', () => {
  it('renders a key value', () => {
    const v = new Vector(1, 2, 3, 4)
    expect(v.key).toEqual('1,2,3,4')
  })

  it('allows access', () => {
    const v = new Vector(1, 2, 3, 4)
    expect(v.x).toBe(1)
    expect(v.y).toBe(2)
    expect(v.z).toBe(3)
    expect(v.at(3)).toBe(4)
  })

  it('out of bound is defaulted to undefined', () => {
    const v = new Vector()
    expect(v.x).toBeUndefined()
    expect(v.y).toBeUndefined()
    expect(v.z).toBeUndefined()
    expect(v.at(4)).toBeUndefined()
  })

  describe('add', () => {
    it('adds equal sized vectors', () => {
      expect(new Vector(1, 2).add(new Vector(2, 1))).toEqual(new Vector(3, 3))
    })

    it('throws on different sized vectors', () => {
      expect(() => new Vector(2).add(new Vector(1, 2))).toThrowError('dimension mismatch')
      expect(() => new Vector(1, 2).add(new Vector(2))).toThrowError('dimension mismatch')
    })
  })

  describe('minus', () => {
    it('substracts equal sized vectors', () => {
      expect(new Vector(1, 2).minus(new Vector(2, 1))).toEqual(new Vector(-1, 1))
    })

    it('throws on different sized vectors', () => {
      expect(() => new Vector(2).minus(new Vector(1, 2))).toThrowError('dimension mismatch')
      expect(() => new Vector(1, 2).minus(new Vector(2))).toThrowError('dimension mismatch')
    })
  })

  describe('bounds', () => {
    it('checks the bounding', () => {
      expect(new Vector(0, 0).bounds(new Vector(0, 0))).toBeFalsy()
      expect(new Vector(1, 1).bounds(new Vector(0, 0))).toBeTruthy()
      expect(new Vector(-2, 2).bounds(new Vector(-1, 1))).toBeTruthy()
    })

    it('throws on different size vectors', () => {
      expect(() => new Vector().bounds(new Vector(0, 0))).toThrowError('dimension mismatch')
    })
  })

  describe('abs', () => {
    it('checks the bounding', () => {
      expect(new Vector().abs()).toEqual(new Vector())
      expect(new Vector(1, 1).abs()).toEqual(new Vector(1, 1))
      expect(new Vector(-2, 2).abs()).toEqual(new Vector(2, 2))
    })
  })

  describe('floor', () => {
    it('rounds down', () => {
      expect(new Vector().floor()).toEqual(new Vector())
      expect(new Vector(1, 1.1, 1.5, 1.9).floor()).toEqual(new Vector(1, 1, 1, 1))
      expect(new Vector(-2, -2.1, -2.5, -2.9).floor()).toEqual(new Vector(-2, -3, -3, -3))
    })
  })

  describe('mult', () => {
    it('checks the bounding', () => {
      expect(new Vector().mult(2)).toEqual(new Vector())
      expect(new Vector(1, 1).mult(-1)).toEqual(new Vector(-1, -1))
      expect(new Vector(-2, 2).mult(0)).toEqual(new Vector(-0, 0))
    })
  })

  describe('interpolate', () => {
    it('returns the extremal points', () => {
      expect(Vector.interpolate(new Vector(1), new Vector(2), 0)).toEqual(new Vector(1))
      expect(Vector.interpolate(new Vector(1), new Vector(2), 1)).toEqual(new Vector(2))
    })

    it('returns internal points', () => {
      expect(Vector.interpolate(new Vector(1), new Vector(2), 0.5)).toEqual(new Vector(1.5))
      expect(Vector.interpolate(new Vector(1), new Vector(2), 0.75)).toEqual(new Vector(1.75))
    })

    it('returns external points', () => {
      expect(Vector.interpolate(new Vector(1), new Vector(2), 1.5)).toEqual(new Vector(2.5))
      expect(Vector.interpolate(new Vector(1), new Vector(2), -0.5)).toEqual(new Vector(0.5))
    })
  })

  describe('perpendicular', () => {
    it('calculates perpendicular vector', () => {
      expect(new Vector(1, 2).perpendicular()).toEqual(new Vector(-2, 1))
    })

    it('needs 2d vector', () => {
      expect(() => new Vector().perpendicular()).toThrowError('wrong dimension')
      expect(() => new Vector(2).perpendicular()).toThrowError('wrong dimension')
      expect(() => new Vector(2, 3, 4).perpendicular()).toThrowError('wrong dimension')
    })
  })
})
