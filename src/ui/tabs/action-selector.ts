import { Action, SelectedAction } from '../../components/action'
import { Vector } from '../../spatial'
import { Renderer } from '../../renderer/renderer'
import { primary, gray } from '../../renderer/palettes'
import { subactionStringify } from '../../component-reducers/subaction-stringify'

import { TlbWorld } from '../../tlb'

import { Rectangle } from '../../geometry/rectangle'
import { Selector, ItemSelector } from '../selector'
import { Tab, TabView, TabsKey } from '../tabs'
import { InputResource, Input, KeyboardCommand } from '../../resources/input'

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

export class ActionSelectorFullView implements TabView, Selector<SelectedAction> {
  private readonly actions: Rectangle
  private readonly descriptions: Rectangle

  private selectedGroupIndex: number | undefined

  public readonly groupSelector: ItemSelector<ActionGroup>
  public actionSelector: ItemSelector<SelectableAction> | undefined

  public constructor(public readonly content: Rectangle, public readonly groups: ActionGroup[]) {
    const width = Math.floor(content.width / 2)
    this.actions = new Rectangle(content.left, content.top, width, content.height)
    this.descriptions = new Rectangle(this.actions.right, content.top, content.width - width, content.height)
    this.groupSelector = new ItemSelector(this.groups)
  }

  public render(renderer: Renderer) {
    this.renderActions(renderer)
    this.renderDescription(renderer)
  }

  public get selected(): SelectedAction | undefined {
    if (this.actionSelector !== undefined && this.selectedGroupIndex !== undefined) {
      const selectedGroup = this.groupSelector.itemAtIndex(this.selectedGroupIndex)
      const selectionAction = this.actionSelector.selected
      if (selectedGroup !== undefined && selectionAction !== undefined) {
        if (selectionAction.available) {
          return {
            entity: selectedGroup.entity,
            action: selectionAction.action,
          }
        }
      }
    }
    return undefined
  }

  public get hovered(): SelectedAction | undefined {
    if (this.actionSelector !== undefined && this.selectedGroupIndex !== undefined) {
      const selectedGroup = this.groupSelector.itemAtIndex(this.selectedGroupIndex)
      const hoveredAction = this.actionSelector.hovered
      if (selectedGroup !== undefined && hoveredAction !== undefined) {
        return {
          entity: selectedGroup.entity,
          action: hoveredAction.action,
        }
      }
    }
    return undefined
  }

  public get length(): number {
    if (this.actionSelector !== undefined) {
      return this.actionSelector.length + 1
    }
    return this.groupSelector.length
  }

  public update(world: TlbWorld) {
    const input: Input = world.getResource<InputResource>('input')
    this.groupSelector.update(world, this.actions)
    if (this.actionSelector !== undefined) {
      this.actionSelector.update(world, this.actions)
      if (input.isActive('cancel')) {
        this.selectedGroupIndex = undefined
        this.actionSelector = undefined
      }
    } else {
      const group = this.groupSelector.selected
      if (group !== undefined) {
        this.selectedGroupIndex = this.groupSelector.selectedIndex
        this.actionSelector = new ItemSelector(group.items)
      }
    }
  }

  private renderActions(renderer: Renderer) {
    let row = 0
    if (this.selectedGroupIndex === undefined) {
      this.groups.forEach((_group, index) => {
        row = this.renderGroup(renderer, row, index)
      })
    } else {
      const actions = this.groupSelector.itemAtIndex(this.selectedGroupIndex)!
      actions.items.forEach((_action, index) => {
        row = this.renderAction(renderer, row, index)
      })
    }
  }

  private renderGroup(renderer: Renderer, row: number, index: number): number {
    const group = this.groupSelector.itemAtIndex(index)
    if (group === undefined || !this.groupSelector.isItemVisible(this.actions, index)) {
      return row
    }
    const hasActions = group.items.find(a => a.available)
    renderer.text(
      `${row + 1} ${group.name}`,
      this.actions.topLeft.add(new Vector([0, row])),
      hasActions ? primary[1] : gray[3],
      this.groupSelector.hoveredIndex === index ? gray[1] : undefined
    )
    return row + 1
  }

  private renderAction(renderer: Renderer, row: number, index: number): number {
    const action = this.actionSelector!.itemAtIndex(index)
    if (action === undefined || !this.actionSelector!.isItemVisible(this.actions, index)) {
      return row
    }
    renderer.text(
      `${row + 1} ${action.action.name}`,
      this.actions.topLeft.add(new Vector([0, row])),
      action.available ? primary[1] : gray[3],
      this.actionSelector!.hoveredIndex === index ? gray[1] : undefined
    )
    return row + 1
  }

  private renderDescription(renderer: Renderer) {
    const hoveredGroup = this.groupSelector.hovered
    const hoveredAction = this.actionSelector && this.actionSelector.hovered
    if (hoveredAction !== undefined) {
      const { name, cost, subActions } = hoveredAction.action
      renderer.text(name, this.descriptions.topLeft, primary[1])
      if (cost.costsAll) {
        renderer.text('cost: all AP, MP', this.descriptions.topLeft.add(new Vector([0, 1])), primary[1])
      } else {
        renderer.text(`cost: ${cost.actions}AP ${cost.movement}MP`, this.descriptions.topLeft.add(new Vector([0, 2])), primary[1])
      }

      let y = 3
      subActions.forEach(subAction => {
        renderer.text(subactionStringify(subAction), this.descriptions.topLeft.add(new Vector([1, y])), primary[1])
        y++
      })
    } else if (hoveredGroup !== undefined) {
      const { name, description } = hoveredGroup
      renderer.text(name, this.descriptions.topLeft, primary[1])
      renderer.flowText(description, this.descriptions.topLeft.add(new Vector([0, 1])), this.descriptions.width - 2, primary[1])
    } else {
      renderer.text('choose an action to perform', this.descriptions.topLeft.add(new Vector([1, 1])), primary[1])
    }
  }
}

export class ActionSelectorMinimizedView implements TabView {
  public constructor(public readonly content: Rectangle, public readonly groups: ActionGroup[]) {}

  public update(_world: TlbWorld) {}

  public render(renderer: Renderer) {
    let row = 0
    this.groups.forEach(group => {
      const hasActions = group.items.find(a => a.available)
      renderer.text(`${row + 1} ${group.name}`, this.content.topLeft.add(new Vector([0, row])), hasActions ? primary[1] : gray[3])
      row++
    })
  }
}

export class ActionSelector implements Tab, Selector<SelectedAction> {
  public readonly key: TabsKey = 'actionSelector'
  public readonly name: string = 'select your move'
  public readonly shortName: string = 'q'
  public readonly command: KeyboardCommand = 'focus'

  public readonly minimizedHint: TabsKey = 'overview'

  public full: ActionSelectorFullView | undefined
  public minimized: ActionSelectorMinimizedView | undefined

  public constructor(public readonly groups: ActionGroup[]) {}

  public setFull(content: Rectangle): void {
    this.full = new ActionSelectorFullView(content, this.groups)
  }

  public setMinimized(content: Rectangle): void {
    this.minimized = new ActionSelectorFullView(content, this.groups)
  }

  public get selected(): SelectedAction | undefined {
    if (this.full === undefined) {
      return undefined
    }
    return this.full.selected
  }

  public get hovered(): SelectedAction | undefined {
    if (this.full === undefined) {
      return undefined
    }
    return this.full.hovered
  }

  public get length(): number {
    if (this.full === undefined) {
      return 0
    }
    return this.full.length
  }
}
