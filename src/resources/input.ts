import { TlbResource, ResourceName } from '../tlb'
import { Vector } from '../spatial'
import { Position } from '../renderer/position'
import { KEYS } from 'rot-js'

export interface Input {
  position: Position | undefined
  mouseDown: boolean
  mousePressed: boolean
  mouseReleased: boolean

  keyDown: Set<number>
  keyPressed: Set<number>
  keyReleased: Set<number>

  createMovementDelta(): Vector
}

export class InputResource implements TlbResource, Input {
  public readonly kind: ResourceName = 'input'

  public position: Position | undefined = undefined

  public mouseDown: boolean = false
  public mousePressed: boolean = false
  public mouseReleased: boolean = false

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

  public createMovementDelta(): Vector {
    let delta = new Vector(0, 0)
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
