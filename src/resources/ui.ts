import { ResourceName, TlbResource, TlbWorld } from '../tlb'
import { Vector } from '../spatial'
import { Rectangle } from '../geometry/rectangle'
import { Renderer } from '../renderer/renderer'
import { InputResource, Input } from './input'
import { ViewportResource, Viewport } from './viewport'
import { KEYS } from 'rot-js'
import { SelectedAction } from '../components/action'
import { ActionSelector, ActionGroup } from '../ui/action-selector'

export interface UI {
  hasElement(position: Vector): boolean
  render(renderer: Renderer): void

  showActionSelector(world: TlbWorld, title: string, groups: ActionGroup[]): void
  selectedAction(): SelectedAction | undefined
  hideActionSelector(world: TlbWorld): void
}

export class UIResource implements TlbResource, UI {
  public readonly kind: ResourceName = 'ui'

  public visibleElements: Rectangle[] = []

  private actionSelector: ActionSelector | undefined = undefined

  public update(world: TlbWorld): void {
    const input: Input = world.getResource<InputResource>('input')
    let position
    if (input.position) {
      position = new Vector(input.position.x, input.position.y)
    }
    const pressed = input.mousePressed || input.keyPressed.has(KEYS.VK_RETURN)
    const up = input.keyPressed.has(KEYS.VK_K)
    const down = input.keyPressed.has(KEYS.VK_J)
    this.updateActionSelector(position, pressed, up, down)
  }

  public updateActionSelector(position: Vector | undefined, pressed: boolean, up: boolean, down: boolean) {
    if (this.actionSelector !== undefined) {
      this.actionSelector.update(position, pressed, up, down)
    }
  }

  public render(renderer: Renderer): void {
    if (this.actionSelector !== undefined) {
      this.actionSelector.render(renderer)
    }
  }

  public showActionSelector(world: TlbWorld, title: string, groups: ActionGroup[]) {
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')

    let element
    if (this.actionSelector !== undefined) {
      element = this.actionSelector.element
    } else {
      element = world.createEntity().entity
    }

    const rows = groups.map(g => g.actions.length + 1).reduce((a, b) => a + b)
    const height = rows + 2

    const actionsWindow = new Rectangle(5, viewport.boundaries.y - height, 20, height)
    const descriptionWindow = new Rectangle(actionsWindow.right, viewport.boundaries.y - height, 32, height)

    this.actionSelector = new ActionSelector({
      groups,
      rows,
      actionsWindow,
      descriptionWindow,
      title,
      element,
      hovered: 0,
      selected: undefined,
    })
  }

  public hideActionSelector(world: TlbWorld) {
    if (this.actionSelector !== undefined) {
      world.deleteEntity(this.actionSelector.element)
      this.actionSelector = undefined
    }
  }

  public selectedAction(): SelectedAction | undefined {
    if (this.actionSelector !== undefined) {
      return this.actionSelector.selectedAction
    }
    return undefined
  }

  public hasElement(position: Vector): boolean {
    return this.actionSelector !== undefined && this.actionSelector.hasElement(position)
  }
}
