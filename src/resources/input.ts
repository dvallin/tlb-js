import { TlbResource, ResourceName } from '../tlb'
import { Vector } from '../spatial'
import { Position } from '../renderer/position'
import { KEYS } from 'rot-js'

export const defaultKeyMapping: { [key in KeyboardCommand]: number | Key } = {
  // player controls
  left: KEYS.VK_H,
  down: KEYS.VK_J,
  up: KEYS.VK_K,
  right: KEYS.VK_L,
  use: KEYS.VK_E,

  // ui interaction
  accept: KEYS.VK_RETURN,
  cancel: KEYS.VK_ESCAPE,

  0: KEYS.VK_1,
  1: KEYS.VK_2,
  2: KEYS.VK_3,
  3: KEYS.VK_4,
  4: KEYS.VK_5,
  5: KEYS.VK_6,
  6: KEYS.VK_7,
  7: KEYS.VK_8,
  8: KEYS.VK_9,

  // tabs selection
  inventory: KEYS.VK_I,
  log: KEYS.VK_O,
  overview: KEYS.VK_U,
  focus: KEYS.VK_Q,

  // options
  grid: KEYS.VK_G,
}

export interface Key {
  shift: boolean
  ctrl: boolean
  meta: boolean
  alt: boolean
  pressed: number
}

export type NumericKeyboardCommand = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type OptionsKeyboardCommand = 'grid'
export type TabKeyboardCommand = 'inventory' | 'log' | 'focus' | 'overview'
export type UIInteractionKeyboardCommand = 'accept' | 'cancel'
export type PlayerInteractionKeyboardCommand = 'left' | 'down' | 'up' | 'right' | 'use'
export type KeyboardCommand =
  | NumericKeyboardCommand
  | PlayerInteractionKeyboardCommand
  | UIInteractionKeyboardCommand
  | TabKeyboardCommand
  | OptionsKeyboardCommand

export interface Input {
  position: Position | undefined
  mouseDown: boolean
  mousePressed: boolean
  mouseReleased: boolean

  numericActive(): NumericKeyboardCommand | undefined
  isActive(key: KeyboardCommand): boolean

  createMovementDelta(): Vector
}

export class InputResource implements TlbResource, Input {
  public readonly kind: ResourceName = 'input'

  public position: Position | undefined = undefined

  public mouseDown: boolean = false
  public mousePressed: boolean = false
  public mouseReleased: boolean = false

  public shift: boolean = false
  public ctrl: boolean = false
  public alt: boolean = false
  public meta: boolean = false

  public keyDown: Set<number> = new Set()
  public keyPressed: Set<number> = new Set()
  public keyReleased: Set<number> = new Set()

  private mouseEvent: MouseEvent | undefined = undefined
  private keyEvents: KeyboardEvent[] = []

  public constructor(public readonly eventToPosition: (event: MouseEvent | TouchEvent) => Position | undefined) {
    document.addEventListener('mousedown', e => (this.mouseEvent = e))
    document.addEventListener('mousemove', e => (this.mouseEvent = e))
    document.addEventListener('keydown', e => this.keyEvents.push(e))
    document.addEventListener('keyup', e => this.keyEvents.push(e))
  }

  public update(): void {
    this.handleMouseEvent()
    this.handleKeyboardEvents()
  }

  isActive(command: KeyboardCommand): boolean {
    const mapped = defaultKeyMapping[command]
    if (typeof mapped === 'number') {
      return !this.shift && !this.alt && !this.ctrl && !this.meta && this.keyPressed.has(mapped)
    } else {
      return (
        this.shift === mapped.shift &&
        this.alt === mapped.alt &&
        this.ctrl === mapped.ctrl &&
        this.meta === mapped.meta &&
        this.keyPressed.has(mapped.pressed)
      )
    }
  }

  numericActive(): NumericKeyboardCommand | undefined {
    const numerics: NumericKeyboardCommand[] = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    return numerics.find(k => this.isActive(k))
  }

  public createMovementDelta(): Vector {
    let delta = new Vector([0, 0])
    if (this.keyDown.has(KEYS.VK_H)) {
      delta = delta.add(Vector.fromDirection('left'))
    }
    if (this.keyDown.has(KEYS.VK_J)) {
      delta = delta.add(Vector.fromDirection('down'))
    }
    if (this.keyDown.has(KEYS.VK_K)) {
      delta = delta.add(Vector.fromDirection('up'))
    }
    if (this.keyDown.has(KEYS.VK_L)) {
      delta = delta.add(Vector.fromDirection('right'))
    }
    return delta.normalize()
  }

  private handleMouseEvent(): void {
    this.mouseReleased = false
    this.mousePressed = false
    if (this.mouseEvent) {
      this.position = this.eventToPosition(this.mouseEvent)
      const pressed = this.mouseEvent.buttons > 0
      if (pressed) {
        if (this.position) {
          this.mousePressed = true
          this.mouseDown = true
        }
      } else {
        this.mouseDown = false
        this.mouseReleased = true
      }
      this.mouseEvent = undefined
    }
  }

  private handleKeyboardEvents(): void {
    this.keyPressed.clear()
    this.keyReleased.clear()
    for (const e of this.keyEvents) {
      this.shift = e.shiftKey
      this.ctrl = e.ctrlKey
      this.alt = e.altKey
      this.meta = e.metaKey
      if (e.type === 'keydown') {
        this.keyPressed.add(e.keyCode)
        this.keyDown.add(e.keyCode)
      } else {
        this.keyReleased.add(e.keyCode)
        this.keyDown.delete(e.keyCode)
      }
    }
    this.keyEvents = []
  }
}
