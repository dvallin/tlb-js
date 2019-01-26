import * as ROT from 'rot-js'
import { Input } from '../../src/resources/input'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { Render } from '../../src/resources/render'
import { mockRenderer } from '../mocks'
import { Renderer } from '../../src/renderer/renderer'

describe('Input', () => {
  let input: Input
  let world: TlbWorld
  let renderer: Renderer
  beforeEach(() => {
    input = new Input()
    world = new World()
    renderer = mockRenderer()
    world.registerResource(new Render(renderer))
  })

  describe('key down', () => {
    it('registers as keydown', () => {
      // given
      keyEvent('keydown', ROT.VK_0)

      // when
      input.update(world)

      // then
      expect(input.keyDown.has(ROT.VK_0)).toBeTruthy()
    })

    it('registers as keypressed', () => {
      // given
      keyEvent('keydown', ROT.VK_0)

      // when
      input.update(world)

      // then
      expect(input.keyPressed.has(ROT.VK_0)).toBeTruthy()
    })

    it('resets keypressed', () => {
      // given
      keyEvent('keydown', ROT.VK_0)

      // when
      input.update(world)
      input.update(world)

      // then
      expect(input.keyPressed.has(ROT.VK_0)).toBeFalsy()
      expect(input.keyDown.has(ROT.VK_0)).toBeTruthy()
    })
  })

  describe('key up', () => {
    it('resets keydown', () => {
      // given
      input.keyDown.add(ROT.VK_0)
      keyEvent('keyup', ROT.VK_0)

      // when
      input.update(world)

      // then
      expect(input.keyDown.has(ROT.VK_0)).toBeFalsy()
    })

    it('registers as keyreleased', () => {
      // given
      input.keyDown.add(ROT.VK_0)
      keyEvent('keyup', ROT.VK_0)

      // when
      input.update(world)

      // then
      expect(input.keyReleased.has(ROT.VK_0)).toBeTruthy()
    })

    it('resets keyreleased', () => {
      // given
      input.keyDown.add(ROT.VK_0)
      keyEvent('keyup', ROT.VK_0)

      // when
      input.update(world)
      input.update(world)

      // then
      expect(input.keyReleased.has(ROT.VK_0)).toBeFalsy()
      expect(input.keyDown.has(ROT.VK_0)).toBeFalsy()
    })
  })

  describe('pressed mouse button', () => {
    it('registers mouse down', () => {
      // given
      renderer.eventToPosition = jest.fn().mockReturnValue({ x: 42, y: 43 })
      mouseEvent('mousedown', 1)

      // when
      input.update(world)

      // then
      expect(input.mouseDown).toBeTruthy()
    })

    it('registers mouse position', () => {
      // given
      renderer.eventToPosition = jest.fn().mockReturnValue({ x: 42, y: 43 })
      mouseEvent('mousedown', 1)

      // when
      input.update(world)

      // then
      expect(input.position).toEqual({ x: 42, y: 43 })
    })

    it('does not register mouse down if position is outside world ', () => {
      // given
      renderer.eventToPosition = jest.fn().mockReturnValue(undefined)
      mouseEvent('mousedown', 1)

      // when
      input.update(world)

      // then
      expect(input.mouseDown).toBeFalsy()
      expect(input.position).toBeUndefined()
    })

    it('registers mousepressed', () => {
      // given
      renderer.eventToPosition = jest.fn().mockReturnValue({ x: 32, y: 32 })
      mouseEvent('mousedown', 1)

      // when
      input.update(world)

      // then
      expect(input.mousePressed).toBeTruthy()
    })

    it('unregisters mousepressed', () => {
      // given
      renderer.eventToPosition = jest.fn().mockReturnValue({ x: 32, y: 32 })
      mouseEvent('mousedown', 1)

      // when
      input.update(world)
      input.update(world)

      // then
      expect(input.mousePressed).toBeFalsy()
      expect(input.mouseDown).toBeTruthy()
    })
  })

  describe('not pressed mouse button', () => {
    it('unregisters mouse down', () => {
      // given
      input.mouseDown = true
      renderer.eventToPosition = jest.fn().mockReturnValue({ x: 42, y: 43 })
      mouseEvent('mousemove', 0)

      // when
      input.update(world)

      // then
      expect(input.mouseDown).toBeFalsy()
    })

    it('registers mouse position', () => {
      // given
      renderer.eventToPosition = jest.fn().mockReturnValue({ x: 42, y: 43 })
      mouseEvent('mousemove', 0)

      // when
      input.update(world)

      // then
      expect(input.position).toEqual({ x: 42, y: 43 })
    })

    it('unregsiters mouse down if position is outside world ', () => {
      // given
      input.mouseDown = true
      renderer.eventToPosition = jest.fn().mockReturnValue(undefined)
      mouseEvent('mousemove', 0)

      // when
      input.update(world)

      // then
      expect(input.mouseDown).toBeFalsy()
      expect(input.position).toBeUndefined()
    })

    it('registers mousereleased', () => {
      // given
      input.mouseDown = true
      renderer.eventToPosition = jest.fn().mockReturnValue({ x: 32, y: 32 })
      mouseEvent('mousemove', 0)

      // when
      input.update(world)

      // then
      expect(input.mouseReleased).toBeTruthy()
    })

    it('unregisters mouseReleased', () => {
      // given
      input.mouseDown = true
      renderer.eventToPosition = jest.fn().mockReturnValue({ x: 32, y: 32 })
      mouseEvent('mousemove', 0)

      // when
      input.update(world)
      input.update(world)

      // then
      expect(input.mouseReleased).toBeFalsy()
      expect(input.mouseDown).toBeFalsy()
    })
  })
})

function keyEvent(type: 'keydown' | 'keyup', keyCode: number): void {
  document.dispatchEvent(Object.assign(new Event(type), { keyCode }))
}

function mouseEvent(type: 'mousedown' | 'mousemove', buttons: number): void {
  document.dispatchEvent(Object.assign(new Event(type), { buttons }))
}
