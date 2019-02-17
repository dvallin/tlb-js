import { Queries } from '../../src/renderer/queries'
import { Vector } from '../../src/spatial'
import { TlbWorld } from '../../src/tlb'
import { WorldMap } from '../../src/resources/world-map'
import { World } from '../../src/ecs/world'
import { mockMap, mockImplementation2 } from '../mocks'
import { Color } from '../../src/renderer/color'

describe('RotRayCaster', () => {
  let world: TlbWorld
  let map: WorldMap
  beforeEach(() => {
    world = new World()
    map = mockMap(world)
  })

  it('calculates field of view', () => {
    const callback = jest.fn()
    mockImplementation2(map.isLightBlocking, ({}, position: Vector) => {
      return position.key !== '1,1' && position.key !== '1,2'
    })

    new Queries().fov(world, new Vector(1, 1), callback)

    expect(callback).toHaveBeenCalledTimes(12)
    // non-light blocking
    expect(callback).toHaveBeenCalledWith(new Vector(1, 1), 0)
    expect(callback).toHaveBeenCalledWith(new Vector(1, 2), 1)
    // visible light blocking
    expect(callback).toHaveBeenCalledWith(new Vector(0, 0), 1)
    expect(callback).toHaveBeenCalledWith(new Vector(1, 0), 1)
    expect(callback).toHaveBeenCalledWith(new Vector(2, 0), 1)
    expect(callback).toHaveBeenCalledWith(new Vector(0, 1), 1)
    expect(callback).toHaveBeenCalledWith(new Vector(2, 1), 1)
    expect(callback).toHaveBeenCalledWith(new Vector(0, 2), 1)
    expect(callback).toHaveBeenCalledWith(new Vector(2, 2), 1)
    expect(callback).toHaveBeenCalledWith(new Vector(0, 3), 2)
    expect(callback).toHaveBeenCalledWith(new Vector(1, 3), 2)
    expect(callback).toHaveBeenCalledWith(new Vector(2, 3), 2)
  })

  it('calculates lighting', () => {
    const callback = jest.fn()
    mockImplementation2(map.isLightBlocking, ({}, position: Vector) => {
      return position.key !== '1,1' && position.key !== '1,2'
    })

    new Queries().lighting(world, new Vector(1, 1), new Color([123, 123, 123]), callback)

    expect(callback).toHaveBeenCalledTimes(12)
    // non-light blocking
    expect(callback).toHaveBeenCalledWith(new Vector(1, 1), new Color([123, 123, 123]))
    expect(callback).toHaveBeenCalledWith(new Vector(1, 2), new Color([103, 103, 103]))
    // visible light blocking
    expect(callback).toHaveBeenCalledWith(new Vector(0, 0), new Color([103, 103, 103]))
    expect(callback).toHaveBeenCalledWith(new Vector(1, 0), new Color([103, 103, 103]))
    expect(callback).toHaveBeenCalledWith(new Vector(2, 0), new Color([103, 103, 103]))
    expect(callback).toHaveBeenCalledWith(new Vector(0, 1), new Color([103, 103, 103]))
    expect(callback).toHaveBeenCalledWith(new Vector(2, 1), new Color([103, 103, 103]))
    expect(callback).toHaveBeenCalledWith(new Vector(0, 2), new Color([103, 103, 103]))
    expect(callback).toHaveBeenCalledWith(new Vector(2, 2), new Color([103, 103, 103]))
    expect(callback).toHaveBeenCalledWith(new Vector(0, 3), new Color([82, 82, 82]))
    expect(callback).toHaveBeenCalledWith(new Vector(1, 3), new Color([82, 82, 82]))
    expect(callback).toHaveBeenCalledWith(new Vector(2, 3), new Color([82, 82, 82]))
  })
})
