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
import { BodyPartSelector, BodyPartInfo } from '../ui/body-part-selector'
import { InventoryTransferModal } from '../ui/inventory-transfer-modal'

export interface UI {
  hasElement(position: Vector): boolean
  render(renderer: Renderer): void

  isModal: boolean

  showInventoryTransferModal(world: TlbWorld, source: Entity, target: Entity): void
  inventoryTransferModalShowing(): boolean
  hideInventoryTransferModal(world: TlbWorld): void

  showActionSelector(world: TlbWorld, groups: ActionGroup[]): void
  selectedAction(): SelectedAction | undefined
  hideActionSelector(world: TlbWorld): void

  showBodyPartSelector(world: TlbWorld, target: Entity, bodyParts: BodyPartInfo[]): void
  selectedBodyPart(): string | undefined
  hideBodyPartSelector(world: TlbWorld): void

  setOverview(world: TlbWorld, focus: Entity): void
  setLog(world: TlbWorld): void
}

export class UIResource implements TlbResource, UI {
  public readonly kind: ResourceName = 'ui'

  public visibleElements: Rectangle[] = []

  public isModal: boolean = false

  private bodyPartSelector: BodyPartSelector | undefined = undefined
  private actionSelector: ActionSelector | undefined = undefined
  private inventoryTransferModal: InventoryTransferModal | undefined = undefined
  private overview: Overview | undefined = undefined
  private log: LogView | undefined = undefined

  public update(world: TlbWorld): void {
    if (this.isModal) {
      if (this.inventoryTransferModal !== undefined) {
        this.inventoryTransferModal.update(world)
        if (this.inventoryTransferModal.closed) {
          this.hideInventoryTransferModal(world)
        }
      }
    }

    if (this.actionSelector !== undefined) {
      this.actionSelector.update(world)
    }
    if (this.overview !== undefined) {
      this.overview.update(world)
    }
    if (this.log !== undefined) {
      this.log.update(world)
    }
    if (this.bodyPartSelector !== undefined) {
      this.bodyPartSelector.update(world)
    }
  }

  public render(renderer: Renderer): void {
    if (this.inventoryTransferModal !== undefined) {
      this.inventoryTransferModal.render(renderer)
    }
    if (this.actionSelector !== undefined) {
      this.actionSelector.render(renderer)
    }
    if (this.overview !== undefined) {
      this.overview.render(renderer)
    }
    if (this.log !== undefined) {
      this.log.render(renderer)
    }
    if (this.bodyPartSelector !== undefined) {
      this.bodyPartSelector.render(renderer)
    }
  }

  public setOverview(world: TlbWorld, focus: Entity) {
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const entity = this.getOrCreateElement(world, this.overview)
    this.overview = new Overview(entity, focus, new Vector([viewport.boundaries.x - 20, 0]), 20)
  }

  public setLog(world: TlbWorld) {
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const entity = this.getOrCreateElement(world, this.log)
    this.log = new LogView(entity, new Rectangle(0, viewport.boundaries.y - 13, 41, 13))
  }

  public showInventoryTransferModal(world: TlbWorld, source: Entity, target: Entity): void {
    this.isModal = true

    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const leftWindow = new WindowDecoration(
      new Rectangle(viewport.boundaries.x / 2 - 20, viewport.boundaries.y / 2 - 20, 20, 20),
      'other inventory'
    )
    const rightWindow = new WindowDecoration(
      new Rectangle(viewport.boundaries.x / 2, viewport.boundaries.y / 2 - 20, 20, 20),
      'your inventory'
    )

    const entity = this.getOrCreateElement(world, this.actionSelector)
    this.inventoryTransferModal = new InventoryTransferModal(entity, {
      left: source,
      right: target,
      leftWindow,
      rightWindow,
      leftActive: true,
      hovered: 0,
    })
  }

  public inventoryTransferModalShowing(): boolean {
    return this.inventoryTransferModal !== undefined
  }

  public hideInventoryTransferModal(world: TlbWorld) {
    if (this.inventoryTransferModal !== undefined) {
      world.deleteEntity(this.inventoryTransferModal.entity)
      this.inventoryTransferModal = undefined
    }
  }

  public showActionSelector(world: TlbWorld, groups: ActionGroup[]) {
    this.hideBodyPartSelector(world)

    const viewport: Viewport = world.getResource<ViewportResource>('viewport')

    const rows = groups.map(g => g.actions.length + 1).reduce((a, b) => a + b)
    const height = 13

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
      hovered: 0,
      firstRow: 0,
      selected: undefined,
    })
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

  public showBodyPartSelector(world: TlbWorld, target: Entity, bodyParts: BodyPartInfo[]): void {
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const height = 13

    const bodyPartWindow = new WindowDecoration(
      new Rectangle(viewport.boundaries.x - 40, viewport.boundaries.y - height, 20, height),
      'body parts'
    )

    const descriptionWindow = new WindowDecoration(
      new Rectangle(bodyPartWindow.right, viewport.boundaries.y - height, 20, height),
      'description'
    )

    const entity = this.getOrCreateElement(world, this.actionSelector)
    this.bodyPartSelector = new BodyPartSelector(entity, {
      bodyParts,
      bodyPartWindow,
      descriptionWindow,
      target,
      hovered: 0,
      selected: undefined,
    })
  }

  public selectedBodyPart(): string | undefined {
    if (this.bodyPartSelector !== undefined) {
      return this.bodyPartSelector.selectedBodyPart
    }
    return undefined
  }

  public hideBodyPartSelector(world: TlbWorld): void {
    if (this.bodyPartSelector !== undefined) {
      world.deleteEntity(this.bodyPartSelector.entity)
      this.bodyPartSelector = undefined
    }
  }

  public getOrCreateElement(world: TlbWorld, uiElement: UIElement | undefined): Entity {
    if (uiElement !== undefined) {
      return uiElement.entity
    } else {
      return world.createEntity().entity
    }
  }

  public hasElement(position: Vector): boolean {
    return (
      (this.actionSelector !== undefined && this.actionSelector.contains(position)) ||
      (this.overview !== undefined && this.overview.contains(position)) ||
      (this.log !== undefined && this.log.contains(position)) ||
      (this.bodyPartSelector !== undefined && this.bodyPartSelector.contains(position)) ||
      (this.isModal && this.inventoryTransferModal !== undefined && this.inventoryTransferModal.contains(position))
    )
  }
}
