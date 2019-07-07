import { Action, SelectedAction } from '../components/action'
import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'
import { Renderer } from '../renderer/renderer'
import { primary, gray } from '../renderer/palettes'
import { subactionStringify } from '../component-reducers/subaction-stringify'

import { UIElement } from './ui-element'
import { TlbWorld } from '../tlb'

import { WindowDecoration } from './window-decoration'
import { Rectangle } from '../geometry/rectangle'
import {
  CollapsibleGroupItemSelector,
  CollapsibleGroupSelector,
  CollapsibleGroupValue,
  SelectorState,
  updateSelectorState,
  isLineVisible,
  Selector,
} from './selector'

export interface SelectableAction {
  action: Action
  available: boolean
}

export interface ActionGroup {
  entity: number
  description: string
  name: string
  items: SelectableAction[]
}

export interface State {
  actionsWindow: WindowDecoration
  descriptionWindow: WindowDecoration

  groups: CollapsibleGroupValue<ActionGroup, SelectableAction>[]
}

export class ActionSelector implements UIElement, Selector<SelectedAction> {
  private readonly selectorState: SelectorState
  public readonly actionSelector: CollapsibleGroupItemSelector<ActionGroup, SelectableAction>
  public readonly groupSelector: CollapsibleGroupSelector<ActionGroup, SelectableAction>

  public constructor(public readonly entity: Entity, private readonly state: State) {
    this.selectorState = { focused: true, firstRow: 0, hovered: 0, selected: undefined }
    this.actionSelector = new CollapsibleGroupItemSelector(this.selectorState, this.state.groups)
    this.groupSelector = new CollapsibleGroupSelector(this.selectorState, this.state.groups)
  }

  public static build(entity: Entity, bounds: Rectangle, groups: ActionGroup[]): ActionSelector {
    const width = Math.floor(bounds.width / 2)
    const actionsWindow = new WindowDecoration(new Rectangle(bounds.left, bounds.top, width, bounds.height), 'actions')
    const descriptionWindow = new WindowDecoration(
      new Rectangle(actionsWindow.right, bounds.top, bounds.width - width, bounds.height),
      'description'
    )

    const collapsibleGroups = groups.map(g => ({ ...g, collapsed: false }))

    return new ActionSelector(entity, {
      groups: collapsibleGroups,
      actionsWindow,
      descriptionWindow,
    })
  }

  public render(renderer: Renderer) {
    this.renderActions(renderer)
    this.renderDescription(renderer)
  }

  public get selected(): SelectedAction | undefined {
    const selection = this.actionSelector.selected
    if (selection !== undefined) {
      return {
        entity: selection.group.entity,
        action: selection.item.action,
      }
    }
    return undefined
  }

  public get hovered(): SelectedAction | undefined {
    const selection = this.actionSelector.hovered
    if (selection !== undefined) {
      return {
        entity: selection.group.entity,
        action: selection.item.action,
      }
    }
    return undefined
  }

  public get length(): number {
    return this.actionSelector.length + this.groupSelector.length
  }

  public update(world: TlbWorld) {
    updateSelectorState(world, this.selectorState, this.state.actionsWindow.content, this.length)
    const group = this.groupSelector.selected
    if (group !== undefined) {
      this.selectorState.selected = undefined
      group.collapsed = !group.collapsed
    }
  }

  private renderActions(renderer: Renderer) {
    this.state.actionsWindow.render(renderer)

    let index = 0
    let row = 0
    this.state.groups.forEach(group => {
      const hasActions = group.items.find(a => a.available)
      if (isLineVisible(this.selectorState, this.state.actionsWindow.content, index)) {
        renderer.text(
          `${group.collapsed ? '+' : '-'} ${group.name}`,
          this.state.actionsWindow.topLeft.add(new Vector([1, row + 1])),
          hasActions ? primary[1] : gray[3],
          this.selectorState.hovered === index ? gray[1] : undefined
        )
        row++
      }
      index++
      if (!group.collapsed) {
        group.items.forEach(action => {
          if (isLineVisible(this.selectorState, this.state.actionsWindow.content, index)) {
            renderer.text(
              ` | ${action.action.name}`,
              this.state.actionsWindow.topLeft.add(new Vector([1, row + 1])),
              action.available ? primary[1] : gray[3],
              this.selectorState.hovered === index && action.available ? gray[1] : undefined
            )
            row++
          }
          index++
        })
      }
    })
  }

  private renderDescription(renderer: Renderer) {
    this.state.descriptionWindow.render(renderer)

    const hoveredAction = this.actionSelector.hovered
    if (hoveredAction !== undefined) {
      const { name, cost, subActions } = hoveredAction.item.action
      renderer.text(name, this.state.descriptionWindow.topLeft.add(new Vector([1, 1])), primary[1])
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
      subActions.forEach(subAction => {
        renderer.text(subactionStringify(subAction), this.state.descriptionWindow.topLeft.add(new Vector([1, y])), primary[1])
        y++
      })
    } else {
      const hoveredGroup = this.groupSelector.hovered
      if (hoveredGroup !== undefined) {
        const { name, description } = hoveredGroup
        renderer.text(name, this.state.descriptionWindow.topLeft.add(new Vector([1, 1])), primary[1])
        renderer.flowText(
          description,
          this.state.descriptionWindow.topLeft.add(new Vector([1, 2])),
          this.state.descriptionWindow.width - 2,
          primary[1]
        )
      } else {
        renderer.text('choose an action to perform', this.state.descriptionWindow.topLeft.add(new Vector([1, 1])), primary[1])
      }
    }
  }

  public contains(position: Vector): boolean {
    return this.state.actionsWindow.containsVector(position) || this.state.descriptionWindow.containsVector(position)
  }
}
