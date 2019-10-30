import { Vector } from '../../src/spatial/vector'
import { DiscreteSetSpace, SetSpace } from '../../src/spatial/set-space'
import { Rectangle } from '../../src/geometry/rectangle'

describe('DiscreteSetSpace', () => {
  testSetSpace(new Vector([0, 2]), () => new DiscreteSetSpace(10))
})

function testSetSpace(position: Vector, spaceBuilder: () => SetSpace): void {
  let space: SetSpace
  beforeEach(() => {
    space = spaceBuilder()
  })

  describe('set and has', () => {
    it('has element if it is set', () => {
      space.set(position)
      expect(space.has(position)).toBeTruthy()
    })

    it('does not have element if it is not set', () => {
      expect(space.has(position)).toBeFalsy()
    })
  })

  it('removes from unoccupied', () => {
    const occupied = space.remove(position)
    expect(occupied).toBeFalsy()
    expect(space.has(position)).toBeFalsy()
  })

  it('removes from occupied', () => {
    space.set(position)
    const occupied = space.remove(position)
    expect(occupied).toBeTruthy()
    expect(space.has(position)).toBeFalsy()
  })

  describe('setAll', () => {
    it('sets all cells', () => {
      space.setAll(new Rectangle(0, 0, 1, 1))
      space.has(new Vector([0, 0]))
      space.has(new Vector([1, 0]))
      space.has(new Vector([0, 1]))
      space.has(new Vector([1, 1]))
    })
  })
}
