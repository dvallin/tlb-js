import { DiscreteStackedSpace, SubStackedSpace, StackedSpace } from '../../src/spatial/stacked-space'
import { Vector } from '../../src/spatial/vector'

describe('DiscreteStackedSpace', () => {
  testStackedSpace(new Vector([0, 2]), () => new DiscreteStackedSpace())
})

describe('SubStackedSpace', () => {
  testStackedSpace(new Vector([0]), () => new SubStackedSpace(new DiscreteStackedSpace(), (v: Vector) => new Vector([v.x, 2])))
})

function testStackedSpace(position: Vector, spaceBuilder: () => StackedSpace<string>): void {
  let space: StackedSpace<string>
  beforeEach(() => {
    space = spaceBuilder()
  })

  describe('get and set', () => {
    it('sets and gets stacks', () => {
      space.set(position, ['a', 'b'])
      expect(space.get(position)).toEqual(['a', 'b'])
    })

    it('works for empty stacks', () => {
      expect(space.get(position)).toEqual([])
    })
  })

  it('adds to stacks', () => {
    space.add(position, 'a')
    space.add(position, 'b')
    expect(space.get(position)).toEqual(['a', 'b'])
  })

  describe('retain', () => {
    it('retains values', () => {
      space.set(position, ['c', 'a', 'c', 'b', 'c'])
      space.retain(position, c => c !== 'c')
      expect(space.get(position)).toEqual(['a', 'b'])
    })

    it('works for empty stacks', () => {
      space.retain(position, c => c !== 'c')
      expect(space.get(position)).toEqual([])
    })
  })
}
