import { TlbWorld } from '../tlb'
import { Input, InputResource } from '../resources/input'
import { Vector } from '../spatial'
import { KEYS } from 'rot-js'
import { Rectangle } from '../geometry/rectangle'

export interface Selector<T> {
  hovered: T | undefined
  selected: T | undefined
  length: number
}

export interface SelectorState {
  firstRow: number
  selected: number | undefined
  hovered: number
}

export interface CollapsibleGroup<T> {
  collapsed: boolean
  items: (T & { available: boolean })[]
}

export class ItemSelector<T> implements Selector<T> {
  public constructor(private readonly state: SelectorState, private items: T[]) {}

  public get selected(): T | undefined {
    if (this.state.selected !== undefined) {
      const { selected } = this.state
      return this.itemAtLine(selected)
    }
    return undefined
  }

  public get hovered(): T | undefined {
    if (this.state.hovered !== undefined) {
      const { hovered } = this.state
      return this.itemAtLine(hovered)
    }
    return undefined
  }

  public get length(): number {
    return this.items.length
  }

  private itemAtLine(line: number): T | undefined {
    return this.items[line]
  }
}

export type CollapsibleGroupValue<S, T> = S & CollapsibleGroup<T>

export class CollapsibleGroupSelector<S, T> implements Selector<S> {
  public constructor(private readonly state: SelectorState, private groups: CollapsibleGroupValue<S, T>[]) {}

  public get selected(): CollapsibleGroupValue<S, T> | undefined {
    if (this.state.selected !== undefined) {
      const { selected } = this.state
      return this.groupAtLine(selected)
    }
    return undefined
  }

  public get hovered(): CollapsibleGroupValue<S, T> | undefined {
    if (this.state.hovered !== undefined) {
      const { hovered } = this.state
      return this.groupAtLine(hovered)
    }
    return undefined
  }

  public get length(): number {
    return this.groups.length
  }

  private groupAtLine(line: number): CollapsibleGroupValue<S, T> | undefined {
    for (const group of this.groups) {
      if (line === 0) {
        return group
      }
      line -= 1
      if (group.collapsed) {
        continue
      }
      line -= group.items.length
    }
    return undefined
  }
}

export class CollapsibleGroupItemSelector<S, T> implements Selector<{ group: S; item: T }> {
  public constructor(private readonly state: SelectorState, private groups: CollapsibleGroupValue<S, T>[]) {}

  public get selected(): { group: S; item: T } | undefined {
    if (this.state.selected !== undefined) {
      return this.itemAtLine(this.state.selected)
    }
    return undefined
  }

  public get hovered(): { group: S; item: T } | undefined {
    if (this.state.hovered !== undefined) {
      return this.itemAtLine(this.state.hovered)
    }
    return undefined
  }

  public get length(): number {
    return this.groups.map(g => (g.collapsed ? 0 : g.items.length)).reduce((a, b) => a + b, 0)
  }

  private itemAtLine(line: number): { group: S; item: T } | undefined {
    for (const group of this.groups) {
      line -= 1
      if (group.collapsed) {
        continue
      }
      if (line < 0) {
        return undefined
      } else if (line >= group.items.length) {
        line -= group.items.length
      } else {
        const item = group.items[line]
        if (item !== undefined && item.available) {
          return {
            group,
            item: group.items[line],
          }
        }
      }
    }
    return undefined
  }
}

export function updateSelectorState(world: TlbWorld, current: SelectorState, content: Rectangle, availableRows: number): boolean {
  const input: Input = world.getResource<InputResource>('input')
  let position: Vector | undefined
  if (input.position) {
    position = new Vector([input.position.x, input.position.y])
  }
  const up = input.keyPressed.has(KEYS.VK_K)
  const down = input.keyPressed.has(KEYS.VK_J)
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
  let collapseSelected = false
  if (position && content.containsVector(position)) {
    const delta = position.minus(content.topLeft)
    current.hovered = delta.y + current.firstRow
    if (input.mousePressed) {
      current.selected = delta.y + current.firstRow
    }
  }

  if (input.keyPressed.has(KEYS.VK_RETURN)) {
    current.selected = current.hovered
  }
  return collapseSelected
}

export function isLineVisible(current: SelectorState, content: Rectangle, index: number): boolean {
  return index >= current.firstRow && index < current.firstRow + content.height
}
