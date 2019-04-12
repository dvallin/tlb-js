import { astar } from '../../src/renderer/astar'
import { Vector } from '../../src/spatial'
import { FunctionalShape } from '../../src/geometry/functional-shape'

describe('astar', () => {
  const p0 = new Vector(0, 0)
  const p1 = new Vector(2, 2)

  it('finds a path if goal is already reached', () => {
    const path = astar(p0, p0, () => 1, p => FunctionalShape.lN(p), p => p1.minus(p).lN(), 3)
    expect(path).toEqual({ cost: 0, path: [new Vector(0, 0)] })
  })

  it('does not find a path if cost is undefined', () => {
    const path = astar(p0, p1, () => undefined, p => FunctionalShape.lN(p), p => p1.minus(p).lN(), 3)
    expect(path).toBeUndefined()
  })

  it('actually finds a good path', () => {
    const path = astar(
      p0,
      p1,
      (a, b) => {
        if (a.key === '0,0' && b.key === '0,1') {
          return 1
        }
        if (a.key === '0,0' && b.key === '1,0') {
          return 3
        }
        if (a.key === '0,1' && b.key === '1,1') {
          return 5
        }
        if (a.key === '1,0' && b.key === '1,1') {
          return 1
        }
        if (a.key === '1,1' && b.key === '1,2') {
          return 1
        }
        if (a.key === '1,2' && b.key === '2,2') {
          return 1
        }
        return undefined
      },
      p => FunctionalShape.l1(p),
      p => p1.minus(p).l1(),
      10
    )
    expect(path!.cost).toEqual(6)
  })

  describe('LN neighbourhood', () => {
    it('finds a path', () => {
      const path = astar(p0, p1, () => 1, p => FunctionalShape.lN(p), p => p1.minus(p).lN(), 3)
      expect(path).toEqual({ cost: 2, path: [new Vector(2, 2), new Vector(1, 1), new Vector(0, 0)] })
    })
  })

  describe('L1 neighbourhood', () => {
    it('does not find a path has cost of 3', () => {
      const path = astar(p0, p1, () => 1, p => FunctionalShape.l1(p), p => p1.minus(p).lN(), 3)
      expect(path).toBeUndefined()
    })

    it('finds a path', () => {
      const path = astar(p0, p1, () => 1, p => FunctionalShape.l1(p), p => p1.minus(p).lN(), 4)
      expect(path).toEqual({ cost: 4, path: [new Vector(2, 2), new Vector(1, 2), new Vector(1, 1), new Vector(0, 1), new Vector(0, 0)] })
    })
  })

  describe('best effort mode', () => {
    it('finds a path as far as possible along the optimal path', () => {
      const path = astar(p0, p1, () => 1, p => FunctionalShape.l1(p), p => p1.minus(p).lN(), 2, true)
      expect(path).toEqual({ cost: 2, path: [new Vector(1, 1), new Vector(0, 1), new Vector(0, 0)] })
    })

    it('finds a path as heuristically close as possible to the target', () => {
      const path = astar(
        p0,
        p1,
        (s, t) => (t.key !== p1.key ? s.minus(t).l1() : undefined),
        p => FunctionalShape.lN(p),
        p => p1.minus(p).l1(),
        2,
        true
      )
      expect(path).toEqual({ cost: 2, path: [new Vector(1, 1), new Vector(0, 0)] })
    })
  })
})
