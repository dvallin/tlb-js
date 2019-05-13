import { Action, SelectedAction } from '../components/action'
import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'
import { Renderer } from '../renderer/renderer'
import { primary, gray } from '../renderer/palettes'

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
  entity: number
  description: string
  name: string
  actions: SelectableAction[]
}

export interface State {
  title: string
  actionsWindow: WindowDecoration
  descriptionWindow: WindowDecoration
  element: Entity
  rows: number

  groups: ActionGroup[]

  selected: number | undefined
  hovered: number
}

export class ActionSelector implements UIElement {
  public constructor(private readonly state: State) {}

  public render(renderer: Renderer) {
    const { actionsWindow, descriptionWindow, groups, hovered } = this.state
    this.renderActions(renderer, actionsWindow, groups, hovered)
    this.renderDescription(renderer, descriptionWindow, groups, hovered)
  }

  public get element(): Entity {
    return this.state.element
  }

  public update(world: TlbWorld) {
    const input: Input = world.getResource<InputResource>('input')
    let position
    if (input.position) {
      position = new Vector(input.position.x, input.position.y)
    }
    const pressed = input.mousePressed || input.keyPressed.has(KEYS.VK_RETURN)
    const up = input.keyPressed.has(KEYS.VK_K)
    const down = input.keyPressed.has(KEYS.VK_J)

    this.state.selected = undefined
    const content = this.state.actionsWindow.content
    if (position && content.containsVector(position)) {
      const delta = position.minus(content.topLeft)
      this.state.hovered = delta.y
    }
    if (up) {
      this.state.hovered--
    }
    if (down) {
      this.state.hovered++
    }
    this.state.hovered += this.state.rows
    this.state.hovered %= this.state.rows

    if (pressed) {
      this.state.selected = this.state.hovered
    }
  }

  public get selectedAction(): SelectedAction | undefined {
    if (this.state.selected !== undefined) {
      const { groups, selected } = this.state
      return this.actionAtLine(groups, selected)
    }
    return undefined
  }

  private renderActions(renderer: Renderer, window: WindowDecoration, groups: ActionGroup[], hovered: number) {
    window.render(renderer)

    let index = 0
    groups.forEach(group => {
      const hasActions = group.actions.find(a => a.available)
      renderer.text(
        `- ${group.name}`,
        window.topLeft.add(new Vector(1, index + 1)),
        hasActions ? primary[1] : gray[3],
        hovered === index ? gray[1] : undefined
      )
      index++
      group.actions.forEach(action => {
        renderer.text(
          ` | ${action.action.name}`,
          window.topLeft.add(new Vector(1, index + 1)),
          action.available ? primary[1] : gray[3],
          hovered === index && action.available ? gray[1] : undefined
        )
        index++
      })
    })
  }

  private renderDescription(renderer: Renderer, window: WindowDecoration, groups: ActionGroup[], hovered: number) {
    window.render(renderer)

    const action = this.actionAtLine(groups, hovered)
    if (action !== undefined) {
      renderer.text(action.action.name, window.topLeft.add(new Vector(1, 1)), primary[1])
      const cost = action.action.cost
      if (cost.costsAll) {
        renderer.text('costs all AP and MP', window.topLeft.add(new Vector(1, 2)), primary[1])
      } else {
        renderer.text(`cost: ${cost.actions}AP ${cost.movement}MP`, window.topLeft.add(new Vector(1, 2)), primary[1])
      }
    } else {
      const group = this.groupAtLine(groups, hovered)
      if (group !== undefined) {
        renderer.text(group.name, window.topLeft.add(new Vector(1, 1)), primary[1])
        renderer.flowText(group.description, window.topLeft.add(new Vector(1, 2)), window.width - 2, primary[1])
      } else {
        renderer.text('choose an action to perform', window.topLeft.add(new Vector(1, 1)), primary[1])
      }
    }
  }

  private groupAtLine(groups: ActionGroup[], line: number): ActionGroup | undefined {
    for (const group of groups) {
      if (line === 0) {
        return group
      }
      line -= group.actions.length + 1
    }
    return undefined
  }

  private actionAtLine(groups: ActionGroup[], line: number): SelectedAction | undefined {
    for (const group of groups) {
      line -= 1
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
