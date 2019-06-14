import { ViewportResource } from '../../src/resources/viewport'

import { World } from '../../src/ecs/world'
import { TlbWorld } from '../../src/tlb'

import { mockMap, mockImplementation, mockInput } from '../mocks'
import { MapStorage } from '../../src/ecs/storage'
import { WorldMapResource } from '../../src/resources/world-map'
import { Vector } from '../../src/spatial/vector'
import { PositionComponent } from '../../src/components/position'

describe('Viewport', () => {
  let viewport: ViewportResource

  let map: WorldMapResource
  let world: TlbWorld
  beforeEach(() => {
    world = new World()
    map = mockMap(world)
    mockImplementation(map.tiles.get, (vector: Vector) => (vector.key === '1,1' ? 42 : undefined))
    mockInput(world)

    world.registerComponentStorage('viewport-focus', new MapStorage<{}>())
    world.registerComponentStorage('position', new MapStorage<PositionComponent>())

    viewport = new ViewportResource(new Vector([30, 40]))
  })

  describe('update', () => {
    it('focuses on selected position', () => {
      // given
      viewport.focus = jest.fn()
      world
        .createEntity()
        .withComponent<PositionComponent>('position', { position: new Vector([1, 2]) })
        .withComponent('viewport-focus', {}).entity

      // when
      viewport.update(world)

      // then
      expect(viewport.focus).toHaveBeenCalledWith(new Vector([1, 2]))
    })
  })

  describe('toDisplay', () => {
    const point1 = new Vector([1, -2])
    const point2 = new Vector([1.5, -2.5])

    it('rounds down if grid locked', () => {
      viewport.gridLocked = true
      expect(viewport.toDisplay(point1, false)).toEqual({ x: 1, y: -2 })
      expect(viewport.toDisplay(point1, true)).toEqual({ x: 1, y: -2 })
      expect(viewport.toDisplay(point2, false)).toEqual({ x: 1, y: -3 })
      expect(viewport.toDisplay(point2, true)).toEqual({ x: 1, y: -3 })
    })

    it('keeps floats and centers if not grid locked', () => {
      viewport.gridLocked = false
      expect(viewport.toDisplay(point1, false)).toEqual({ x: 1, y: -2 })
      expect(viewport.toDisplay(point1, true)).toEqual({ x: 1.5, y: -1.75 })
      expect(viewport.toDisplay(point2, false)).toEqual({ x: 1.5, y: -2.5 })
      expect(viewport.toDisplay(point2, true)).toEqual({ x: 2, y: -2.25 })
    })
  })

  describe('focus', () => {
    const point1 = new Vector([1, -2])
    const point2 = new Vector([1.5, -2.5])

    it('rounds down if grid locked', () => {
      viewport.gridLocked = true
      focusAndCheck(point1, new Vector([-9, -17]))
      focusAndCheck(point2, new Vector([-9, -18]))
    })

    it('keeps floats if not grid locked', () => {
      viewport.gridLocked = false
      focusAndCheck(point1, new Vector([-9, -17]))
      focusAndCheck(point2, new Vector([-8.5, -17.5]))
    })

    function focusAndCheck(point: Vector, topLeft: Vector) {
      viewport.focus(point)
      expect(viewport.topLeft).toEqual(topLeft)
    }
  })
})
