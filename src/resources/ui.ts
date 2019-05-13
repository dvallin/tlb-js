import { ResourceName, TlbResource, TlbWorld } from '../tlb'
import { Vector } from '../spatial'
import { Rectangle } from '../geometry/rectangle'
import { Renderer } from '../renderer/renderer'
import { ViewportResource, Viewport } from './viewport'
import { SelectedAction } from '../components/action'
import { ActionSelector, ActionGroup } from '../ui/action-selector'
import { Overview } from '../ui/overview'
import { Entity } from '../ecs/entity'
import { WindowDecoration } from '../ui/window-decoration'

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
  private overview: Overview | undefined = undefined

  public update(world: TlbWorld): void {
    if (this.actionSelector !== undefined) {
      this.actionSelector.update(world)
    }
    if (this.overview !== undefined) {
      this.overview.update(world)
    }
  }

  public render(renderer: Renderer): void {
    if (this.actionSelector !== undefined) {
      this.actionSelector.render(renderer)
    }
    if (this.overview !== undefined) {
      this.overview.render(renderer)
    }
  }

  public setOverview(world: TlbWorld, entity: Entity) {
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')

    let element
    if (this.overview !== undefined) {
      element = this.overview.element
    } else {
      element = world.createEntity().entity
    }

    this.overview = new Overview(entity, element, new Vector(viewport.boundaries.x - 20, 0), 20)
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

    const actionsWindow = new WindowDecoration(new Rectangle(5, viewport.boundaries.y - height, 20, height), 'actions')

    const descriptionWindow = new WindowDecoration(
      new Rectangle(actionsWindow.right, viewport.boundaries.y - height, 32, height),
      'description'
    )

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
    return (
      (this.actionSelector !== undefined && this.actionSelector.contains(position)) ||
      (this.overview !== undefined && this.overview.contains(position))
    )
  }
}
