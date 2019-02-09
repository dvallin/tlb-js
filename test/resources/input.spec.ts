import { KEYS } from 'rot-js'
import { InputResource } from '../../src/resources/input'
import { Position } from '../../src/renderer/position'
import { Vector } from '../../src/spatial'

describe('Input', () => {
  let input: InputResource
  let position: Position | undefined
  beforeEach(() => {
    position = undefined
    input = new InputResource(() => position)
  })

  describe('key down', () => {
    it('registers as keydown', () => {
      // given
      keyEvent('keydown', KEYS.VK_0)

      // when
      input.update()

      // then
      expect(input.keyDown.has(KEYS.VK_0)).toBeTruthy()
    })

    it('registers as keypressed', () => {
      // given
      keyEvent('keydown', KEYS.VK_0)

      // when
      input.update()

      // then
      expect(input.keyPressed.has(KEYS.VK_0)).toBeTruthy()
    })

    it('resets keypressed', () => {
      // given
      keyEvent('keydown', KEYS.VK_0)

      // when
      input.update()
      input.update()

      // then
      expect(input.keyPressed.has(KEYS.VK_0)).toBeFalsy()
      expect(input.keyDown.has(KEYS.VK_0)).toBeTruthy()
    })
  })

  describe('key up', () => {
    it('resets keydown', () => {
      // given
      input.keyDown.add(KEYS.VK_0)
      keyEvent('keyup', KEYS.VK_0)

      // when
      input.update()

      // then
      expect(input.keyDown.has(KEYS.VK_0)).toBeFalsy()
    })

    it('registers as keyreleased', () => {
      // given
      input.keyDown.add(KEYS.VK_0)
      keyEvent('keyup', KEYS.VK_0)

      // when
      input.update()

      // then
      expect(input.keyReleased.has(KEYS.VK_0)).toBeTruthy()
    })

    it('resets keyreleased', () => {
      // given
      input.keyDown.add(KEYS.VK_0)
      keyEvent('keyup', KEYS.VK_0)

      // when
      input.update()
      input.update()

      // then
      expect(input.keyReleased.has(KEYS.VK_0)).toBeFalsy()
      expect(input.keyDown.has(KEYS.VK_0)).toBeFalsy()
    })
  })

  describe('pressed mouse button', () => {
    it('registers mouse down', () => {
      // given
      position = { x: 42, y: 43 }
      mouseEvent('mousedown', 1)

      // when
      input.update()

      // then
      expect(input.mouseDown).toBeTruthy()
    })

    it('registers mouse position', () => {
      // given
      position = { x: 42, y: 43 }
      mouseEvent('mousedown', 1)

      // when
      input.update()

      // then
      expect(input.position).toEqual({ x: 42, y: 43 })
    })

    it('does not register mouse down if position is outside world ', () => {
      // given
      mouseEvent('mousedown', 1)

      // when
      input.update()

      // then
      expect(input.mouseDown).toBeFalsy()
      expect(input.position).toBeUndefined()
    })

    it('registers mousepressed', () => {
      // given
      position = { x: 32, y: 32 }
      mouseEvent('mousedown', 1)

      // when
      input.update()

      // then
      expect(input.mousePressed).toBeTruthy()
    })

    it('unregisters mousepressed', () => {
      // given
      position = { x: 32, y: 32 }
      mouseEvent('mousedown', 1)

      // when
      input.update()
      input.update()

      // then
      expect(input.mousePressed).toBeFalsy()
      expect(input.mouseDown).toBeTruthy()
    })
  })

  describe('not pressed mouse button', () => {
    it('unregisters mouse down', () => {
      // given
      input.mouseDown = true
      position = { x: 42, y: 43 }
      mouseEvent('mousemove', 0)

      // when
      input.update()

      // then
      expect(input.mouseDown).toBeFalsy()
    })

    it('registers mouse position', () => {
      // given
      position = { x: 42, y: 43 }
      mouseEvent('mousemove', 0)

      // when
      input.update()

      // then
      expect(input.position).toEqual({ x: 42, y: 43 })
    })

    it('unregsiters mouse down if position is outside world ', () => {
      // given
      input.mouseDown = true
      mouseEvent('mousemove', 0)

      // when
      input.update()

      // then
      expect(input.mouseDown).toBeFalsy()
      expect(input.position).toBeUndefined()
    })

    it('registers mousereleased', () => {
      // given
      input.mouseDown = true
      position = { x: 32, y: 32 }
      mouseEvent('mousemove', 0)

      // when
      input.update()

      // then
      expect(input.mouseReleased).toBeTruthy()
    })

    it('unregisters mouseReleased', () => {
      // given
      input.mouseDown = true
      position = { x: 32, y: 32 }
      mouseEvent('mousemove', 0)

      // when
      input.update()
      input.update()

      // then
      expect(input.mouseReleased).toBeFalsy()
      expect(input.mouseDown).toBeFalsy()
    })
  })

  describe('createMovementDelta', () => {
    it('moves left on h', () => {
      input.keyDown.add(KEYS.VK_H)
      expect(input.createMovementDelta()).toEqual(new Vector(-1, 0))
    })

    it('moves right on l', () => {
      input.keyDown.add(KEYS.VK_L)
      expect(input.createMovementDelta()).toEqual(new Vector(1, 0))
    })

    it('moves down on j', () => {
      input.keyDown.add(KEYS.VK_J)
      expect(input.createMovementDelta()).toEqual(new Vector(0, 1))
    })

    it('moves up on k', () => {
      input.keyDown.add(KEYS.VK_K)
      expect(input.createMovementDelta()).toEqual(new Vector(0, -1))
    })

    it('normalizes movement', () => {
      input.keyDown.add(KEYS.VK_H)
      input.keyDown.add(KEYS.VK_K)
      expect(input.createMovementDelta()).toEqual(new Vector(-1, -1).normalize())
    })

    it('cancels out movement', () => {
      input.keyDown.add(KEYS.VK_H)
      input.keyDown.add(KEYS.VK_L)
      input.keyDown.add(KEYS.VK_J)
      expect(input.createMovementDelta()).toEqual(new Vector(0, 1))
    })
  })
})

function keyEvent(type: 'keydown' | 'keyup', keyCode: number): void {
  document.dispatchEvent(Object.assign(new Event(type), { keyCode }))
}

function mouseEvent(type: 'mousedown' | 'mousemove', buttons: number): void {
  document.dispatchEvent(Object.assign(new Event(type), { buttons }))
}
