import { TlbWorld } from '../tlb'
import { Input, InputResource } from '../resources/input'
import { Vector } from '../spatial'
import { Rectangle } from '../geometry/rectangle'

export interface Selector<T> {
  hovered: T | undefined
  selected: T | undefined
  length: number
}

export interface SelectorState {
  focused: boolean
  firstRow: number
  selected: number | undefined
  hovered: number
}

export class ItemSelector<T> implements Selector<T> {
  public constructor(
    private items: T[],
    private readonly state: SelectorState = { focused: true, firstRow: 0, hovered: 0, selected: undefined }
  ) {}

  public setItems(items: T[]) {
    this.items = items
  }

  public get selected(): T | undefined {
    if (this.state.selected !== undefined) {
      const { selected } = this.state
      return this.itemAtIndex(selected)
    }
    return undefined
  }

  public get hovered(): T | undefined {
    if (this.state.hovered !== undefined) {
      const { hovered } = this.state
      return this.itemAtIndex(hovered)
    }
    return undefined
  }

  public get selectedIndex(): number | undefined {
    return this.state.selected
  }

  public get hoveredIndex(): number | undefined {
    return this.state.hovered
  }

  public get length(): number {
    return this.items.length
  }

  public itemAtIndex(line: number): T | undefined {
    return this.items[line]
  }

  public update(world: TlbWorld, content: Rectangle): void {
    updateSelectorState(world, this.state, content, this.length)
  }

  public isItemVisible(content: Rectangle, index: number): boolean {
    return isLineVisible(this.state, content, index)
  }
}

export function updateSelectorState(world: TlbWorld, current: SelectorState, content: Rectangle, availableRows: number): void {
  const input: Input = world.getResource<InputResource>('input')
  let position: Vector | undefined
  if (input.position) {
    position = new Vector([input.position.x, input.position.y])
    current.focused = content.containsVector(position)
  } else {
    current.focused = false
  }
  const up = input.isActive('up')
  const down = input.isActive('down')
  if (up) {
    current.hovered--
  }
  if (down) {
    current.hovered++
  }

  current.hovered += availableRows
  current.hovered %= availableRows

  if (current.firstRow > current.hovered) {
    current.firstRow = current.hovered
  } else if (current.firstRow <= current.hovered - content.height) {
    current.firstRow = current.hovered - content.height + 1
  }

  current.selected = undefined
  if (position && content.containsVector(position)) {
    const delta = position.minus(content.topLeft)
    current.hovered = delta.y + current.firstRow
    if (input.mousePressed) {
      current.selected = delta.y + current.firstRow
    }
  }

  if (input.isActive('accept')) {
    current.selected = current.hovered
  }

  const numericPressed = input.numericActive()
  if (numericPressed !== undefined) {
    current.selected = numericPressed
  }
}

export function isLineVisible(current: SelectorState, content: Rectangle, index: number): boolean {
  return index >= current.firstRow && index < current.firstRow + content.height
}
