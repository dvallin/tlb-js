import { RotRenderer } from '../../src/renderer/renderer'

import { Display } from 'rot-js'
import * as rot from 'rot-js'
import { mockComponent, mockImplementation, mockMap, mockUi, mockViewport, mockReturnValue } from '../mocks'
import { Color } from '../../src/renderer/color'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { Viewport } from '../../src/resources/viewport'
import { Vector } from '../../src/spatial'
import { features, FeatureComponent } from '../../src/components/feature'
import { Storage } from '../../src/ecs/storage'
import { WorldMap } from '../../src/resources/world-map'
import { Position } from '../../src/renderer/position'
import { PositionComponent } from '../../src/components/position'

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

describe('RotRenderer create and mound', () => {
  it('creates a display and attaches it to the dom', () => {
    RotRenderer.createAndMount(document.body)
    expect(Display).toHaveBeenCalledTimes(1)
    expect(document.body.appendChild).toHaveBeenCalledTimes(1)
  })
})

describe('RotRenderer', () => {
  let renderer: RotRenderer
  let display: Display
  beforeEach(() => {
    jest.resetAllMocks()
    display = new Display()
    display.clear = jest.fn()
    renderer = new RotRenderer(display, new Color([120, 120, 120]))
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
    beforeEach(() => {
      renderer.clear = jest.fn()

      world = new World()
      mockUi(world)
      mockComponent(world, 'lighting')
      mockComponent(world, 'overlay')
    })

    describe('viewport rendering', () => {
      let viewport: Viewport
      beforeEach(() => {
        viewport = mockViewport(world)
        mockImplementation(viewport.fromDisplay, (p: Position) => new Vector([p.x, p.y]))
      })

      it('clears the screen', () => {
        mockReturnValue(viewport.collectRenderables, [])
        renderer.render(world)
        expect(renderer.clear).toHaveBeenCalledTimes(1)
      })

      it('renders each entity', () => {
        mockReturnValue(viewport.collectRenderables, [
          {
            entity: 42,
            opaque: true,
            centered: true,
          },
          {
            entity: 43,
            opaque: false,
            centered: false,
          },
        ])
        renderer.renderEntity = jest.fn()

        renderer.render(world)

        expect(renderer.renderEntity).toHaveBeenCalledTimes(2)
      })
    })

    describe('entity rendering', () => {
      let featureStorage: Storage<FeatureComponent>
      let positions: Storage<PositionComponent>
      let viewport: Viewport
      beforeEach(() => {
        featureStorage = mockComponent(world, 'feature')
        positions = mockComponent(world, 'position')
        viewport = mockViewport(world)
      })

      it('renders only features', () => {
        renderer.renderFeature = jest.fn()
        const position = { position: new Vector([3, 0]) }
        mockReturnValue(featureStorage.get, { type: 'player' })
        mockReturnValue(positions.get, position)

        renderer.renderEntity(world, viewport, 42, true)

        expect(renderer.renderFeature).toHaveBeenCalledWith(world, viewport, 42, true, features['player'], position)
      })
    })

    describe('feature rendering', () => {
      let map: WorldMap
      let viewport: Viewport
      beforeEach(() => {
        mockComponent(world, 'lighting')
        mockComponent(world, 'overlay')
        map = mockMap(world)
        viewport = mockViewport(world)
      })

      it('renders features', () => {
        const position = { position: new Vector([0, 1]) }

        renderer.renderFeature(world, viewport, 42, true, features['player'], position)

        expect(map.isDiscovered).toHaveBeenCalledWith(new Vector([0, 1]))
      })
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
