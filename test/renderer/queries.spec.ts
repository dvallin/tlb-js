import { Queries } from '../../src/renderer/queries'
import { Vector } from '../../src/spatial'
import { TlbWorld } from '../../src/tlb'
import { WorldMap } from '../../src/resources/world-map'
import { World } from '../../src/ecs/world'
import { mockMap, mockImplementation3 } from '../mocks'

describe('Queries', () => {
  let world: TlbWorld
  let map: WorldMap
  beforeEach(() => {
    world = new World()
    map = mockMap(world)
  })

  it('calculates field of view', () => {
    const callback = jest.fn()
    mockImplementation3(map.levels[0].isLightBlocking, (_a: TlbWorld, position: Vector, _c: boolean) => {
      return position.key !== '1,1' && position.key !== '1,2'
    })

    new Queries().fov(world, 0, new Vector([1.1, 1.1]), callback)

    expect(callback).toHaveBeenCalledTimes(21)
    // non-light blocking
    expect(callback).toHaveBeenCalledWith(new Vector([1, 1]), 0)
    expect(callback).toHaveBeenCalledWith(new Vector([1, 2]), 1)
    // visible light blocking
    expect(callback).toHaveBeenCalledWith(new Vector([0, 0]), 1)
    expect(callback).toHaveBeenCalledWith(new Vector([1, 0]), 1)
    expect(callback).toHaveBeenCalledWith(new Vector([2, 0]), 1)
    expect(callback).toHaveBeenCalledWith(new Vector([0, 1]), 1)
    expect(callback).toHaveBeenCalledWith(new Vector([2, 1]), 1)
    expect(callback).toHaveBeenCalledWith(new Vector([0, 2]), 1)
    expect(callback).toHaveBeenCalledWith(new Vector([2, 2]), 1)
    expect(callback).toHaveBeenCalledWith(new Vector([0, 3]), 2)
    expect(callback).toHaveBeenCalledWith(new Vector([1, 3]), 2)
    expect(callback).toHaveBeenCalledWith(new Vector([2, 3]), 2)
  })
})
