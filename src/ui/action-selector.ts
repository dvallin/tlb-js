import { Action, SelectedAction } from '../components/action'
import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'
import { Renderer } from '../renderer/renderer'
import { primary, gray } from '../renderer/palettes'
import { subactionStringify } from '../component-reducers/subaction-stringify'

import { UIElement } from './ui-element'
import { TlbWorld } from '../tlb'
import { Input, InputResource } from '../resources/input'
import { KEYS } from 'rot-js'

import { WindowDecoration } from './window-decoration'

export interface SelectableAction {
  action: Action
  available: boolean
}

export interface ActionGroup {
  collapsed: boolean
  entity: number
  description: string
  name: string
  actions: SelectableAction[]
}

export interface State {
  actionsWindow: WindowDecoration
  descriptionWindow: WindowDecoration

  groups: ActionGroup[]

  rows: number
  selected: number | undefined
  hovered: number
  firstRow: number
}

export class ActionSelector implements UIElement {
  public constructor(public readonly entity: Entity, private readonly state: State) {}

  public render(renderer: Renderer) {
    this.renderActions(renderer)
    this.renderDescription(renderer)
  }

  public update(world: TlbWorld) {
    const input: Input = world.getResource<InputResource>('input')
    let position
    if (input.position) {
      position = new Vector([input.position.x, input.position.y])
    }
    const up = input.keyPressed.has(KEYS.VK_K)
    const down = input.keyPressed.has(KEYS.VK_J)
    if (up) {
      this.state.hovered--
    }
    if (down) {
      this.state.hovered++
    }
    this.state.hovered += this.state.rows
    this.state.hovered %= this.state.rows

    if (this.state.firstRow > this.state.hovered) {
      this.state.firstRow = this.state.hovered
    } else if (this.state.firstRow <= this.state.hovered - this.state.actionsWindow.content.height) {
      this.state.firstRow = this.state.hovered - this.state.actionsWindow.content.height + 1
    }

    this.state.selected = undefined
    const content = this.state.actionsWindow.content
    if (position && content.containsVector(position)) {
      const delta = position.minus(content.topLeft)
      this.state.hovered = delta.y + this.state.firstRow
      if (input.mousePressed) {
        this.state.selected = delta.y + this.state.firstRow
        this.collapseSelected()
      }
    }

    if (input.keyPressed.has(KEYS.VK_RETURN)) {
      this.state.selected = this.state.hovered
      this.collapseSelected()
    }
  }

  public collapseSelected(): void {
    const group = this.groupAtLine(this.state.selected!)
    if (group !== undefined) {
      this.state.selected = undefined
      group.collapsed = !group.collapsed
    }
  }

  public get selectedAction(): SelectedAction | undefined {
    if (this.state.selected !== undefined) {
      const { selected } = this.state
      return this.actionAtLine(selected)
    }
    return undefined
  }

  private renderActions(renderer: Renderer) {
    this.state.actionsWindow.render(renderer)

    let index = 0
    let row = 0
    this.state.groups.forEach(group => {
      const hasActions = group.actions.find(a => a.available)
      if (this.isLineVisible(index)) {
        renderer.text(
          `${group.collapsed ? '+' : '-'} ${group.name}`,
          this.state.actionsWindow.topLeft.add(new Vector([1, row + 1])),
          hasActions ? primary[1] : gray[3],
          this.state.hovered === index ? gray[1] : undefined
        )
        row++
      }
      index++
      if (!group.collapsed) {
        group.actions.forEach(action => {
          if (this.isLineVisible(index)) {
            renderer.text(
              ` | ${action.action.name}`,
              this.state.actionsWindow.topLeft.add(new Vector([1, row + 1])),
              action.available ? primary[1] : gray[3],
              this.state.hovered === index && action.available ? gray[1] : undefined
            )
            row++
          }
          index++
        })
      }
    })
  }

  private isLineVisible(index: number): boolean {
    return index >= this.state.firstRow && index < this.state.firstRow + this.state.actionsWindow.content.height
  }

  private renderDescription(renderer: Renderer) {
    this.state.descriptionWindow.render(renderer)

    const action = this.actionAtLine(this.state.hovered)
    if (action !== undefined) {
      renderer.text(action.action.name, this.state.descriptionWindow.topLeft.add(new Vector([1, 1])), primary[1])
      const cost = action.action.cost
      if (cost.costsAll) {
        renderer.text('cost: all AP, MP', this.state.descriptionWindow.topLeft.add(new Vector([1, 2])), primary[1])
      } else {
        renderer.text(
          `cost: ${cost.actions}AP ${cost.movement}MP`,
          this.state.descriptionWindow.topLeft.add(new Vector([1, 2])),
          primary[1]
        )
      }

      let y = 3
      action.action.subActions.forEach(subAction => {
        renderer.text(subactionStringify(subAction), this.state.descriptionWindow.topLeft.add(new Vector([1, y])), primary[1])
        y++
      })
    } else {
      const group = this.groupAtLine(this.state.hovered)
      if (group !== undefined) {
        renderer.text(group.name, this.state.descriptionWindow.topLeft.add(new Vector([1, 1])), primary[1])
        renderer.flowText(
          group.description,
          this.state.descriptionWindow.topLeft.add(new Vector([1, 2])),
          this.state.descriptionWindow.width - 2,
          primary[1]
        )
      } else {
        renderer.text('choose an action to perform', this.state.descriptionWindow.topLeft.add(new Vector([1, 1])), primary[1])
      }
    }
  }

  private groupAtLine(line: number): ActionGroup | undefined {
    for (const group of this.state.groups) {
      if (line === 0) {
        return group
      }
      line -= 1
      if (group.collapsed) {
        continue
      }
      line -= group.actions.length
    }
    return undefined
  }

  private actionAtLine(line: number): SelectedAction | undefined {
    for (const group of this.state.groups) {
      line -= 1
      if (group.collapsed) {
        continue
      }
      if (line < 0) {
        return undefined
      } else if (line >= group.actions.length) {
        line -= group.actions.length
      } else {
        const action = group.actions[line]
        if (action.available) {
          return {
            entity: group.entity,
            action: action.action,
          }
        }
      }
    }
    return undefined
  }

  public contains(position: Vector): boolean {
    return this.state.actionsWindow.containsVector(position) || this.state.descriptionWindow.containsVector(position)
  }
}
