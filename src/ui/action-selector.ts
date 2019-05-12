import { Action, SelectedAction } from '../components/action'
import { Rectangle } from '../geometry/rectangle'
import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'
import { Renderer } from '../renderer/renderer'
import { Difference } from '../geometry/difference'
import { primary, gray } from '../renderer/palettes'

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
  actionsWindow: Rectangle
  descriptionWindow: Rectangle
  element: Entity
  rows: number

  groups: ActionGroup[]

  selected: number | undefined
  hovered: number
}

export class ActionSelector {
  public constructor(private readonly state: State) {}

  public render(renderer: Renderer) {
    const { actionsWindow, descriptionWindow, groups, hovered } = this.state
    this.renderActions(renderer, actionsWindow, groups, hovered)
    this.renderDescription(renderer, descriptionWindow, groups, hovered)
  }

  public get element(): Entity {
    return this.state.element
  }

  public update(position: Vector | undefined, pressed: boolean, up: boolean, down: boolean) {
    this.state.selected = undefined
    const content = this.state.actionsWindow.shrink()
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

  private renderActions(renderer: Renderer, window: Rectangle, groups: ActionGroup[], hovered: number) {
    this.renderWindowBorder(renderer, window, 'actions')

    let index = 0
    groups.forEach(group => {
      renderer.text(`- ${group.name}`, window.topLeft.add(new Vector(1, index + 1)), primary[0], hovered === index ? gray[1] : undefined)
      index++
      group.actions.forEach(action => {
        renderer.text(
          ` | ${action.action.name}`,
          window.topLeft.add(new Vector(1, index + 1)),
          primary[0],
          hovered === index ? gray[1] : undefined
        )
        index++
      })
    })
  }

  private renderDescription(renderer: Renderer, window: Rectangle, groups: ActionGroup[], hovered: number) {
    this.renderWindowBorder(renderer, window, 'description')
    const action = this.actionAtLine(groups, hovered)
    if (action !== undefined) {
      renderer.text(action.action.name, window.topLeft.add(new Vector(1, 1)), primary[0])
      const cost = action.action.cost
      if (cost.costsAll) {
        renderer.text('costs all AP and MP', window.topLeft.add(new Vector(1, 2)), primary[0])
      } else {
        renderer.text(`cost: ${cost.actions}AP ${cost.movement}MP`, window.topLeft.add(new Vector(1, 2)), primary[0])
      }
    } else {
      const group = this.groupAtLine(groups, hovered)
      if (group !== undefined) {
        renderer.text(group.name, window.topLeft.add(new Vector(1, 1)), primary[0])
        renderer.flowText(group.description, window.topLeft.add(new Vector(1, 2)), window.width - 2, primary[0])
      }
    }
  }

  private renderWindowBorder(renderer: Renderer, window: Rectangle, title: string) {
    Difference.innerBorder(window).foreach(p => {
      if (p.y === window.top || p.y === window.bottom) {
        renderer.character('-', p, primary[0])
      } else {
        renderer.character('|', p, primary[0])
      }
    })
    const titleText = `/${title}/`
    renderer.text(titleText, { x: window.right - titleText.length, y: window.top }, primary[0])
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
        return {
          entity: group.entity,
          action: group.actions[line].action,
        }
      }
    }
    return undefined
  }

  public hasElement(position: Vector): boolean {
    return this.state.actionsWindow!.containsVector(position) || this.state.descriptionWindow!.containsVector(position)
  }
}
