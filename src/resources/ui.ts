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
import { LogView } from '../ui/log-view'
import { UIElement } from '../ui/ui-element'

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
  private log: LogView | undefined = undefined

  public update(world: TlbWorld): void {
    if (this.actionSelector !== undefined) {
      this.actionSelector.update(world)
    }
    if (this.overview !== undefined) {
      this.overview.update(world)
    }
    if (this.log !== undefined) {
      this.log.update(world)
    }
  }

  public render(renderer: Renderer): void {
    if (this.actionSelector !== undefined) {
      this.actionSelector.render(renderer)
    }
    if (this.overview !== undefined) {
      this.overview.render(renderer)
    }
    if (this.log !== undefined) {
      this.log.render(renderer)
    }
  }

  public setOverview(world: TlbWorld, focus: Entity) {
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const entity = this.getOrCreateElement(world, this.overview)
    this.overview = new Overview(entity, focus, new Vector(viewport.boundaries.x - 20, 0), 20)
  }

  public setLog(world: TlbWorld) {
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const entity = this.getOrCreateElement(world, this.log)
    this.log = new LogView(entity, new Rectangle(0, viewport.boundaries.y - 13, 41, 13))
  }

  public showActionSelector(world: TlbWorld, title: string, groups: ActionGroup[]) {
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')

    const rows = groups.map(g => g.actions.length + 1).reduce((a, b) => a + b)
    const height = rows + 2

    const actionsWindow = new WindowDecoration(
      new Rectangle(viewport.boundaries.x - 40, viewport.boundaries.y - height, 20, height),
      'actions'
    )

    const descriptionWindow = new WindowDecoration(
      new Rectangle(actionsWindow.right, viewport.boundaries.y - height, 20, height),
      'description'
    )

    const entity = this.getOrCreateElement(world, this.actionSelector)
    this.actionSelector = new ActionSelector(entity, {
      groups,
      rows,
      actionsWindow,
      descriptionWindow,
      title,
      hovered: 0,
      selected: undefined,
    })
  }

  public getOrCreateElement(world: TlbWorld, uiElement: UIElement | undefined): Entity {
    if (uiElement !== undefined) {
      return uiElement.entity
    } else {
      return world.createEntity().entity
    }
  }

  public hideActionSelector(world: TlbWorld) {
    if (this.actionSelector !== undefined) {
      world.deleteEntity(this.actionSelector.entity)
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
      (this.overview !== undefined && this.overview.contains(position)) ||
      (this.log !== undefined && this.log.contains(position))
    )
  }
}
