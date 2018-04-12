import { World } from "mogwai-ecs/lib"
import ROT, { VK_J, VK_H, VK_K, VK_L, VK_F1, VK_F2 } from "rot-js"

import { GameSystem, RenderLayer } from "./GameSystem"
import { Direction } from "@/geometry/Direction"
import { Position } from "@/geometry/Position"
import { MenuItems } from "@/systems/Viewport"

export interface InputState {
  isPressed: Map<number, boolean>
  pressed: Set<number>
  released: Set<number>
  mouse: Mouse
  mousePressed: [boolean, boolean]
  mouseReleased: [boolean, boolean]
  modifiers: Modifiers
}

export interface Modifiers {
  ctrl: boolean
  alt: boolean
}

export interface Mouse {
  x: number
  y: number
  clickX: number | undefined
  clickY: number | undefined
  click_count: number
  left: boolean
  right: boolean
}

export class Input implements GameSystem {
  public static NAME: string = "input_mgr"

  public renderLayer: RenderLayer = RenderLayer.None

  private keyMap: { [key: string]: number } = {}

  private state: InputState

  constructor(private eventToPosition: (e: UIEvent) => [number, number] | number) {
    this.state = {
      isPressed: new Map(),
      pressed: new Set(),
      released: new Set(),
      mouse: {
        click_count: 0,
        x: 0,
        y: 0,
        clickX: undefined,
        clickY: undefined,
        left: false,
        right: false
      },
      mousePressed: [false, false],
      mouseReleased: [false, false],
      modifiers: {
        alt: false,
        ctrl: false
      }
    }
  }

  public build({ }: World): void {
    this.keyMap[Direction.West] = VK_H
    this.keyMap[Direction.North] = VK_K
    this.keyMap[Direction.East] = VK_L
    this.keyMap[Direction.South] = VK_J
    this.keyMap[MenuItems.Player] = VK_F1
    this.keyMap[MenuItems.Map] = VK_F2
  }

  public render(): void {
    this.state.pressed = new Set()
    this.state.released = new Set()
    this.state.mousePressed = [false, false]
    this.state.mouseReleased = [false, false]
  }

  public execute({ }: World): void {
    // update is done in render
  }

  public register(world: World): void {
    world.registerSystem(Input.NAME, this)
    document.addEventListener("keydown", this.keydown.bind(this))
    document.addEventListener("keyup", this.keyup.bind(this))
    document.addEventListener("mousemove", this.mousemove.bind(this))
    document.addEventListener("mousedown", this.mousedown.bind(this))
    document.addEventListener("mouseup", this.mouseup.bind(this))
  }

  public pressed(vkCode: number): boolean {
    return this.state.pressed.has(vkCode)
  }

  public released(vkCode: number): boolean {
    return this.state.released.has(vkCode)
  }

  public mousePressed(left: boolean = true): boolean {
    return this.state.mousePressed[left ? 0 : 1]
  }

  public mouseReleased(left: boolean = true): boolean {
    return this.state.mouseReleased[left ? 0 : 1]
  }

  public menuItem(menuItem: MenuItems): boolean {
    return this.isPressed(this.keyMap[menuItem])
  }

  public direction(direction: Direction): boolean {
    return this.isPressed(this.keyMap[direction])
  }

  public movementDelta(): Position {
    let delta = Position.from(Direction.Center)
    delta = this.move(delta, Direction.North)
    delta = this.move(delta, Direction.West)
    delta = this.move(delta, Direction.South)
    delta = this.move(delta, Direction.East)
    return delta
  }


  get mouse(): Mouse {
    return this.state.mouse
  }

  public isPressed(vkCode: number): boolean {
    switch (vkCode) {
      case ROT.VK_ALT:
        return this.state.modifiers.alt
      case ROT.VK_CONTROL:
        return this.state.modifiers.ctrl
      default:
        return this.state.isPressed.get(vkCode) || false
    }
  }

  private move(delta: Position, direction: Direction): Position {
    if (this.direction(direction)) {
      delta = delta.add(Position.from(direction))
    }
    return delta
  }

  private handleModifiers(modifiers: Modifiers, { altKey, ctrlKey }: KeyboardEvent | MouseEvent): void {
    modifiers.alt = altKey
    modifiers.ctrl = ctrlKey
  }


  private handleMouse(mouse: Mouse, e: MouseEvent): void {
    const pos = this.eventToPosition(e) as [number, number]
    mouse.x = pos[0]
    mouse.y = pos[1]

    mouse.left = (e.buttons & 1) === 1
    mouse.right = (e.buttons & 2) === 2
    mouse.click_count = e.detail || 0
  }

  private keydown(event: KeyboardEvent): void {
    this.handleModifiers(this.state.modifiers, event)
    this.state.isPressed.set(event.keyCode, true)
    this.state.pressed.add(event.keyCode)
  }

  private keyup(event: KeyboardEvent): void {
    this.handleModifiers(this.state.modifiers, event)
    this.state.isPressed.set(event.keyCode, false)
    this.state.released.add(event.keyCode)
  }

  private mousedown(event: MouseEvent): void {
    this.handleModifiers(this.state.modifiers, event)
    this.handleMouse(this.state.mouse, event)
    this.state.mouse.clickX = this.state.mouse.x
    this.state.mouse.clickY = this.state.mouse.y
    this.state.mousePressed[0] = (event.buttons & 1) === 1
    this.state.mousePressed[1] = (event.buttons & 2) === 2
  }

  private mouseup(event: MouseEvent): void {
    this.handleModifiers(this.state.modifiers, event)
    this.handleMouse(this.state.mouse, event)
    this.state.mouseReleased[0] = (event.buttons & 1) !== 1
    this.state.mouseReleased[1] = (event.buttons & 2) !== 2
  }

  private mousemove(event: MouseEvent): void {
    this.handleModifiers(this.state.modifiers, event)
    this.handleMouse(this.state.mouse, event)
  }
}
