import { bresenham } from '../../src/renderer/bresenham'
import { Vector } from '../../src/spatial'

function collect(f: Iterable<Vector>) {
  const path = []
  for (const v of f) {
    path.push(v.key)
  }
  return path
}

describe('bresenham', () => {
  it('rasterizes a single point', () => {
    expect(collect(bresenham(new Vector([0, 0]), new Vector([0, 0])))).toEqual(['0,0'])
  })

  it('principal axis', () => {
    expect(collect(bresenham(new Vector([0, 0]), new Vector([2, 0])))).toEqual(['0,0', '1,0', '2,0'])
    expect(collect(bresenham(new Vector([0, 0]), new Vector([-2, 0])))).toEqual(['0,0', '-1,0', '-2,0'])
    expect(collect(bresenham(new Vector([0, 0]), new Vector([0, 2])))).toEqual(['0,0', '0,1', '0,2'])
    expect(collect(bresenham(new Vector([0, 0]), new Vector([0, -2])))).toEqual(['0,0', '0,-1', '0,-2'])
  })

  describe('first quadrant', () => {
    expect(collect(bresenham(new Vector([0, 0]), new Vector([4, 1])))).toEqual(['0,0', '1,0', '2,1', '3,1', '4,1'])
    expect(collect(bresenham(new Vector([0, 0]), new Vector([4, 4])))).toEqual(['0,0', '1,1', '2,2', '3,3', '4,4'])
    expect(collect(bresenham(new Vector([0, 0]), new Vector([1, 4])))).toEqual(['0,0', '0,1', '1,2', '1,3', '1,4'])
    expect(collect(bresenham(new Vector([1, 1]), new Vector([2, 4])))).toEqual(['1,1', '1,2', '2,3', '2,4'])
  })

  describe('second quadrant', () => {
    expect(collect(bresenham(new Vector([0, 0]), new Vector([4, -1])))).toEqual(['0,0', '1,0', '2,-1', '3,-1', '4,-1'])
    expect(collect(bresenham(new Vector([0, 0]), new Vector([4, -4])))).toEqual(['0,0', '1,-1', '2,-2', '3,-3', '4,-4'])
    expect(collect(bresenham(new Vector([0, 0]), new Vector([1, -4])))).toEqual(['0,0', '0,-1', '1,-2', '1,-3', '1,-4'])
    expect(collect(bresenham(new Vector([1, -1]), new Vector([2, -4])))).toEqual(['1,-1', '1,-2', '2,-3', '2,-4'])
  })

  describe('third quadrant', () => {
    expect(collect(bresenham(new Vector([0, 0]), new Vector([-4, -1])))).toEqual(['0,0', '-1,0', '-2,-1', '-3,-1', '-4,-1'])
    expect(collect(bresenham(new Vector([0, 0]), new Vector([-4, -4])))).toEqual(['0,0', '-1,-1', '-2,-2', '-3,-3', '-4,-4'])
    expect(collect(bresenham(new Vector([0, 0]), new Vector([-1, -4])))).toEqual(['0,0', '0,-1', '-1,-2', '-1,-3', '-1,-4'])
    expect(collect(bresenham(new Vector([-1, -1]), new Vector([-2, -4])))).toEqual(['-1,-1', '-1,-2', '-2,-3', '-2,-4'])
  })

  describe('forth quadrant', () => {
    expect(collect(bresenham(new Vector([0, 0]), new Vector([-4, 1])))).toEqual(['0,0', '-1,0', '-2,1', '-3,1', '-4,1'])
    expect(collect(bresenham(new Vector([0, 0]), new Vector([-4, 4])))).toEqual(['0,0', '-1,1', '-2,2', '-3,3', '-4,4'])
    expect(collect(bresenham(new Vector([0, 0]), new Vector([-1, 4])))).toEqual(['0,0', '0,1', '-1,2', '-1,3', '-1,4'])
    expect(collect(bresenham(new Vector([-1, 1]), new Vector([-2, 4])))).toEqual(['-1,1', '-1,2', '-2,3', '-2,4'])
  })
})
