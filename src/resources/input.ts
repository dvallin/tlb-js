import { TlbResource, ResourceName } from '../tlb'
import { Vector } from '../spatial'
import { Position } from '../renderer/position'

export interface Key {
  ctrl: boolean
  meta: boolean
  alt: boolean
  key: string
}

function key(key: string) {
  return {
    ctrl: false,
    meta: false,
    alt: false,
    key,
  }
}

export const defaultKeyMapping: { [key in KeyboardCommand]: Key } = {
  // player controls
  left: key('h'),
  down: key('j'),
  up: key('k'),
  right: key('l'),
  use: key('e'),
  plus: key('+'),
  minus: key('-'),

  // ui interaction
  accept: key('Enter'),
  cancel: key('Escape'),

  0: key('1'),
  1: key('2'),
  2: key('3'),
  3: key('4'),
  4: key('5'),
  5: key('6'),
  6: key('7'),
  7: key('8'),
  8: key('9'),

  // tabs selection
  inventory: key('i'),
  log: key('o'),
  overview: key('u'),
  focus: key('q'),

  // options
  grid: key('g'),
}

export type NumericKeyboardCommand = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type OptionsKeyboardCommand = 'grid'
export type TabKeyboardCommand = 'inventory' | 'log' | 'focus' | 'overview'
export type UIInteractionKeyboardCommand = 'accept' | 'cancel'
export type PlayerInteractionKeyboardCommand = 'left' | 'down' | 'up' | 'right' | 'use' | 'plus' | 'minus'
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

  public keyDown: Set<string> = new Set()
  public keyPressed: Set<string> = new Set()
  public keyReleased: Set<string> = new Set()

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
    return this.alt === mapped.alt && this.ctrl === mapped.ctrl && this.meta === mapped.meta && this.keyPressed.has(mapped.key)
  }

  isDown(command: KeyboardCommand): boolean {
    const mapped = defaultKeyMapping[command]
    return this.alt === mapped.alt && this.ctrl === mapped.ctrl && this.meta === mapped.meta && this.keyDown.has(mapped.key)
  }

  numericActive(): NumericKeyboardCommand | undefined {
    const numerics: NumericKeyboardCommand[] = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    return numerics.find(k => this.isActive(k))
  }

  public createMovementDelta(): Vector {
    let delta = new Vector([0, 0])
    if (this.isDown('left')) {
      delta = delta.add(Vector.fromDirection('left'))
    }
    if (this.isDown('down')) {
      delta = delta.add(Vector.fromDirection('down'))
    }
    if (this.isDown('up')) {
      delta = delta.add(Vector.fromDirection('up'))
    }
    if (this.isDown('right')) {
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
        this.keyPressed.add(e.key)
        this.keyDown.add(e.key)
      } else {
        this.keyReleased.add(e.key)
        this.keyDown.delete(e.key)
      }
    }
    this.keyEvents = []
  }
}
