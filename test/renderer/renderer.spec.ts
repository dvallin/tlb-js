import { RotRenderer } from '../../src/renderer/renderer'

import { Display } from 'rot-js'
import * as rot from 'rot-js'
import { getInstances, mockComponent, mockImplementation, mockMap } from '../mocks'
import { Color } from '../../src/renderer/color'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { ViewportResource } from '../../src/resources/viewport'
import { Vector } from '../../src/spatial'
import { features } from '../../src/components/feature'
import { Storage } from '../../src/ecs/storage'
import { WorldMap } from '../../src/resources/world-map'

class C extends Color {
  public rgb: string

  constructor(color: [number, number, number]) {
    super(color)
    this.rgb = color.join()
  }
}

jest.mock('rot-js')
document.body.appendChild = jest.fn()
rot.Color.toRGB = jest.fn(c => c.join())

describe('RotRenderer', () => {
  let renderer: RotRenderer
  let display: Display
  beforeEach(() => {
    jest.resetAllMocks()
    renderer = new RotRenderer()
    display = getInstances<Display>(Display)[0]
  })

  it('creates a display and attaches it to the dom', () => {
    expect(Display).toHaveBeenCalledTimes(1)
    expect(document.body.appendChild).toHaveBeenCalledTimes(1)
  })

  it('clears the display', () => {
    renderer.clear()
    expect(display.clear).toHaveBeenCalledTimes(1)
  })

  it('maps events to display positions', () => {
    display.eventToPosition = jest
      .fn()
      .mockReturnValueOnce([1, 2])
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(undefined)
    const event = new MouseEvent('click', {})
    expect(renderer.eventToPosition(event)).toEqual({ x: 1, y: 2 })
    expect(renderer.eventToPosition(event)).toBeUndefined()
    expect(renderer.eventToPosition(event)).toBeUndefined()
  })

  describe('render', () => {
    let world: TlbWorld
    let map: WorldMap
    let featureStorage: Storage<{}>
    let positions: Storage<{}>
    let inViewportCharacter: Storage<{}>
    let inViewportTile: Storage<{}>
    beforeEach(() => {
      world = new World()

      world.registerResource(new ViewportResource())

      featureStorage = mockComponent(world, 'feature')
      positions = mockComponent(world, 'position')
      inViewportCharacter = mockComponent(world, 'in-viewport-character')
      inViewportTile = mockComponent(world, 'in-viewport-tile')
      mockComponent(world, 'lighting')
      map = mockMap(world)

      renderer.character = jest.fn()
      renderer.clear = jest.fn()
    })

    it('clears the screen', () => {
      renderer.render(world)

      expect(renderer.clear).toHaveBeenCalledTimes(1)
    })

    it('calls foreach on tiles and characters', () => {
      renderer.render(world)

      expect(inViewportTile.foreach).toHaveBeenCalledTimes(1)
      expect(inViewportCharacter.foreach).toHaveBeenCalledTimes(1)
    })

    it('does not render entities without position and feature', () => {
      mockImplementation(inViewportCharacter.foreach, (f: (entity: number, value: {}) => void) => f(42, {}))
      mockImplementation(inViewportTile.foreach, (f: (entity: number, value: {}) => void) => f(42, {}))

      renderer.render(world)

      expect(renderer.character).toHaveBeenCalledTimes(0)
    })

    it('renders each in viewport tile', () => {
      mockImplementation(inViewportTile.foreach, (f: (entity: number, value: {}) => void) => f(42, {}))
      mockImplementation(featureStorage.get, () => ({ type: 'wall' }))
      mockImplementation(positions.get, () => ({ position: new Vector(2, 43) }))
      mockImplementation(map.isDiscovered, () => true)

      renderer.render(world)

      expect(renderer.character).toHaveBeenCalledTimes(1)
      expect(renderer.character).toHaveBeenCalledWith(features.wall.character, { x: 2, y: 43 }, features.wall.diffuse)
    })

    it('renders each in viewport character', () => {
      mockImplementation(inViewportCharacter.foreach, (f: (entity: number, value: {}) => void) => f(42, {}))
      mockImplementation(featureStorage.get, () => ({ type: 'player' }))
      mockImplementation(positions.get, () => ({ position: new Vector(2, 43) }))
      mockImplementation(map.isDiscovered, () => true)

      renderer.render(world)

      expect(renderer.character).toHaveBeenCalledTimes(1)
      expect(renderer.character).toHaveBeenCalledWith(features.player.character, { x: 1.5, y: 42.75 }, features.player.diffuse)
    })
  })

  describe('character', () => {
    it('without background', () => {
      renderer.character('c', { x: 1, y: 2 }, new C([255, 128, 0]))
      expect(display.draw).toHaveBeenCalledTimes(1)
      expect(display.draw).toHaveBeenCalledWith(1, 2, 'c', '255,128,0', null)
    })

    it('with background', () => {
      renderer.character('c', { x: 1, y: 2 }, new C([255, 128, 0]), new C([0, 1, 2]))
      expect(display.draw).toHaveBeenCalledTimes(1)
      expect(display.draw).toHaveBeenCalledWith(1, 2, 'c', '255,128,0', '0,1,2')
    })

    it('draws only first character', () => {
      renderer.character('cde', { x: 1, y: 2 }, new C([255, 128, 0]), new C([0, 1, 2]))
      expect(display.draw).toHaveBeenCalledTimes(1)
      expect(display.draw).toHaveBeenCalledWith(1, 2, 'c', '255,128,0', '0,1,2')
    })
  })

  describe('text', () => {
    it('without background', () => {
      renderer.text('abc', { x: 1, y: 2 }, new C([255, 128, 0]))
      expect(display.draw).toHaveBeenCalledTimes(3)
      expect(display.draw).toHaveBeenCalledWith(1, 2, 'a', '255,128,0', null)
      expect(display.draw).toHaveBeenCalledWith(2, 2, 'b', '255,128,0', null)
      expect(display.draw).toHaveBeenCalledWith(3, 2, 'c', '255,128,0', null)
    })

    it('with background', () => {
      renderer.text('abc', { x: 1, y: 2 }, new C([255, 128, 0]), new C([0, 1, 2]))
      expect(display.draw).toHaveBeenCalledTimes(3)
      expect(display.draw).toHaveBeenCalledWith(1, 2, 'a', '255,128,0', '0,1,2')
      expect(display.draw).toHaveBeenCalledWith(2, 2, 'b', '255,128,0', '0,1,2')
      expect(display.draw).toHaveBeenCalledWith(3, 2, 'c', '255,128,0', '0,1,2')
    })
  })
})
