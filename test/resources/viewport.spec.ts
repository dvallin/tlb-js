import { Viewport } from '../../src/resources/viewport'

import { World } from '../../src/ecs/world'
import { TlbWorld } from '../../src/tlb'

import { mockComponent, mockMap, mockImplementation } from '../mocks'
import { Storage, MapStorage } from '../../src/ecs/storage'
import { WorldMap } from '../../src/resources/world-map'
import { Vector } from '../../src/spatial/vector'
import { PositionComponent } from '../../src/components/position'

describe('Viewport', () => {
  let viewport: Viewport

  let inViewportCharacter: Storage<{}>
  let inViewportTile: Storage<{}>
  let map: WorldMap
  let world: TlbWorld
  beforeEach(() => {
    world = new World()
    map = mockMap(world)
    mockImplementation(map.tiles.get, (vector: Vector) => (vector.key === '1,1' ? 42 : undefined))
    inViewportCharacter = mockComponent(world, 'in-viewport-character')
    inViewportTile = mockComponent(world, 'in-viewport-tile')

    world.registerComponentStorage('viewport-focus', new MapStorage<{}>())
    world.registerComponentStorage('position', new MapStorage<PositionComponent>())

    viewport = new Viewport()
  })

  describe('update', () => {
    it('focuses on selected position', () => {
      // given
      viewport.focus = jest.fn()
      world
        .createEntity()
        .withComponent<PositionComponent>('position', { position: new Vector(1, 2) })
        .withComponent('viewport-focus', {}).entity

      // when
      viewport.update(world)

      // then
      expect(viewport.focus).toHaveBeenCalledWith(new Vector(1, 2))
    })

    it('adds entities into the viewport', () => {
      viewport.update(world)

      expect(map.tiles.get).toHaveBeenCalledTimes(60 * 40)
    })

    it('clears in viewport components', () => {
      viewport.update(world)

      expect(inViewportTile.clear).toHaveBeenCalledTimes(1)
      expect(inViewportCharacter.clear).toHaveBeenCalledTimes(1)
    })

    it('adds tiles into the viewport', () => {
      mockImplementation(map.tiles.get, (vector: Vector) => (vector.key === '1,1' ? 42 : undefined))

      viewport.update(world)

      expect(inViewportTile.insert).toHaveBeenCalledWith(42, {})
    })

    it('adds characters into the viewport', () => {
      mockImplementation(map.characters.get, (vector: Vector) => (vector.key === '1,1' ? 42 : undefined))

      viewport.update(world)

      expect(inViewportCharacter.insert).toHaveBeenCalledWith(42, {})
    })
  })

  describe('toDisplay', () => {
    const point1 = new Vector(1, -2)
    const point2 = new Vector(1.5, -2.5)

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
      expect(viewport.toDisplay(point1, true)).toEqual({ x: 0.5, y: -2.25 })
      expect(viewport.toDisplay(point2, false)).toEqual({ x: 1.5, y: -2.5 })
      expect(viewport.toDisplay(point2, true)).toEqual({ x: 1, y: -2.75 })
    })
  })

  describe('focus', () => {
    const point1 = new Vector(1, -2)
    const point2 = new Vector(1.5, -2.5)

    it('rounds down if grid locked', () => {
      viewport.gridLocked = true
      focusAndCheck(point1, new Vector(-29, -22))
      focusAndCheck(point2, new Vector(-29, -23))
    })

    it('keeps floats if not grid locked', () => {
      viewport.gridLocked = false
      focusAndCheck(point1, new Vector(-29, -22))
      focusAndCheck(point2, new Vector(-28.5, -22.5))
    })

    function focusAndCheck(point: Vector, topLeft: Vector) {
      viewport.focus(point)
      expect(viewport.topLeft).toEqual(topLeft)
    }
  })
})
