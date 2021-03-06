import { ResourceName, TlbResource, TlbWorld } from '../tlb'
import { Vector } from '../spatial'
import { Rectangle } from '../geometry/rectangle'
import { Renderer } from '../renderer/renderer'
import { ViewportResource, Viewport } from './viewport'
import { SelectedAction, Movement } from '../components/action'
import { ActionSelector, ActionGroup } from '../ui/tabs/action-selector'
import { Overview } from '../ui/tabs/overview'
import { Entity } from '../ecs/entity'
import { WindowDecoration } from '../ui/window-decoration'
import { InventoryTransferModal } from '../ui/inventory-transfer-modal'
import { Inventory } from '../ui/tabs/inventory'
import { MultipleChoiceModal, MultipleChoiceOption } from '../ui/multiple-choice-modal'
import { Tabs } from '../ui/tabs'
import { LogTab } from '../ui/tabs/log'
import { MovementSelector } from '../ui/tabs/movement-selector'
import { Queries } from '../renderer/queries'
import { Path } from '../renderer/astar'
import { AttackSelector } from '../ui/tabs/attack-selector'
import { DialogType, dialogs, AnswerType } from '../assets/dialogs'
import { DialogModal } from '../ui/dialog-modal'
import { Random } from '../random'
import { State } from '../game-states/state'
import { Modal } from '../game-states/modal'
import { MultipleChoiceSelector } from '../ui/tabs/multiple-choice-tab'

export interface UI {
  hasElement(position: Vector): boolean
  render(renderer: Renderer): void

  isModal: boolean

  reset(): void

  showInventoryTransferModal(world: TlbWorld, source: Entity, sourceTitle: string, target: Entity, targetTitle: string): void
  inventoryTransferModalShowing(): boolean
  hideInventoryTransferModal(): void

  showMultipleChoiceModal(world: TlbWorld, title: string, options: MultipleChoiceOption[]): void
  selectedModalOption(): Entity | undefined
  multipleChoiceModalShowing(): boolean
  hideMultipleChoiceModal(): void

  showDialogModal(world: TlbWorld, random: Random, dialog: DialogType, player: Entity, npc: Entity): void
  dialogResult(): AnswerType | undefined
  dialogShowing(): boolean
  hideDialogModal(): void

  hideSelectors(): void

  showActionSelector(groups: ActionGroup[]): void
  selectedAction(): SelectedAction | undefined

  showMovementSelector(target: Entity, queries: Queries, movement: Movement): void
  selectedMovement(): Path | undefined

  showAttackSelector(target: Entity, queries: Queries, range: number): void
  selectedAttack(): Path | undefined

  showMultipleChoiceSelector(options: MultipleChoiceOption[]): void
  selectedOption(): Entity | undefined

  createTabs(world: TlbWorld, focus: Entity): void
}

export function runDialog(
  ui: UI,
  world: TlbWorld,
  random: Random,
  dialog: DialogType,
  player: Entity,
  npc: Entity,
  pushState: (state: State) => void
): AnswerType | undefined {
  const result = ui.dialogResult()
  if (!ui.dialogShowing()) {
    ui.showDialogModal(world, random, dialog, player, npc)
    pushState(new Modal(world.activeSystemsList()))
  } else if (result !== undefined) {
    ui.hideDialogModal()
  }
  return result
}

const modalOffsetY = 15

export class UIResource implements TlbResource, UI {
  public readonly kind: ResourceName = 'ui'

  public visibleElements: Rectangle[] = []

  public isModal: boolean = false

  private inventoryTransferModal: InventoryTransferModal | undefined = undefined
  private multipleChoiceModal: MultipleChoiceModal | undefined = undefined
  private dialogModal: DialogModal | undefined = undefined

  private tabs: Tabs | undefined = undefined

  private actionSelector: ActionSelector | undefined = undefined
  private movementSelector: MovementSelector | undefined = undefined
  private attackSelector: AttackSelector | undefined = undefined
  private multipleChoiceSelector: MultipleChoiceSelector | undefined = undefined

  public update(world: TlbWorld): void {
    if (this.isModal) {
      if (this.inventoryTransferModal !== undefined) {
        this.inventoryTransferModal.update(world)
        if (this.inventoryTransferModal.closed) {
          this.hideInventoryTransferModal()
        }
      } else if (this.multipleChoiceModal !== undefined) {
        this.multipleChoiceModal.update(world)
        if (this.multipleChoiceModal.closed) {
          this.isModal = false
        }
      } else if (this.dialogModal !== undefined) {
        this.dialogModal.update(world)
        if (this.dialogModal.closed) {
          this.isModal = false
        }
      }
    }

    if (this.tabs !== undefined) {
      this.tabs.update(world)
    }
  }

  public render(renderer: Renderer): void {
    if (this.tabs !== undefined) {
      this.tabs.render(renderer)
    }

    if (this.inventoryTransferModal !== undefined) {
      this.inventoryTransferModal.render(renderer)
    } else if (this.multipleChoiceModal !== undefined) {
      this.multipleChoiceModal.render(renderer)
    } else if (this.dialogModal !== undefined) {
      this.dialogModal.render(renderer)
    }
  }

  reset(): void {
    this.inventoryTransferModal = undefined
    if (this.tabs !== undefined) {
      this.tabs.reset()
    }
  }

  public createTabs(world: TlbWorld, focus: Entity): void {
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const full = new Rectangle(0, viewport.boundaries.y - 12, viewport.boundaries.x, 12)
    const minimized = new Rectangle(viewport.boundaries.x - 20, 0, 20, 9)
    this.tabs = new Tabs(full, minimized)
    this.tabs.add(new LogTab())
    this.tabs.add(new Inventory(focus))
    this.tabs.add(new Overview(focus))
  }

  public showInventoryTransferModal(world: TlbWorld, source: Entity, sourceTitle: string, target: Entity, targetTitle: string): void {
    this.isModal = true

    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const bounds = new Rectangle(viewport.boundaries.x / 2 - 30, viewport.boundaries.y / 2 - modalOffsetY, 60, 20)

    this.inventoryTransferModal = InventoryTransferModal.build(bounds, source, sourceTitle, target, targetTitle)
  }

  public inventoryTransferModalShowing(): boolean {
    return this.inventoryTransferModal !== undefined
  }

  public hideInventoryTransferModal() {
    if (this.inventoryTransferModal !== undefined) {
      this.inventoryTransferModal = undefined
    }
  }

  public showMultipleChoiceModal(world: TlbWorld, title: string, options: { entity: Entity; description: string }[]): void {
    this.isModal = true

    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const window = new WindowDecoration(
      new Rectangle(viewport.boundaries.x / 2 - 20, viewport.boundaries.y / 2 - modalOffsetY, 40, 10),
      title
    )

    this.multipleChoiceModal = new MultipleChoiceModal(window, options)
  }

  public selectedModalOption(): number | undefined {
    if (this.multipleChoiceModal !== undefined) {
      const s = this.multipleChoiceModal.selector.selected
      if (s !== undefined) {
        return s.entity
      }
    }
    return undefined
  }

  public multipleChoiceModalShowing(): boolean {
    return this.multipleChoiceModal !== undefined
  }

  public hideMultipleChoiceModal() {
    if (this.multipleChoiceModal !== undefined) {
      this.multipleChoiceModal = undefined
    }
  }

  public showDialogModal(world: TlbWorld, random: Random, dialog: DialogType, player: Entity, npc: Entity): void {
    this.isModal = true

    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const window = new WindowDecoration(
      new Rectangle(viewport.boundaries.x / 2 - 20, viewport.boundaries.y / 2 - modalOffsetY, 40, 10),
      'dialog'
    )

    this.dialogModal = new DialogModal(world, random, window, dialogs[dialog], player, npc)
  }

  public dialogResult(): AnswerType | undefined {
    if (this.dialogModal !== undefined) {
      return this.dialogModal.result
    }
    return undefined
  }

  public dialogShowing(): boolean {
    return this.dialogModal !== undefined
  }

  public hideDialogModal() {
    if (this.dialogModal !== undefined) {
      this.dialogModal = undefined
    }
  }

  public hideSelectors(): void {
    this.movementSelector = undefined
    this.actionSelector = undefined
    this.attackSelector = undefined
    this.multipleChoiceSelector = undefined
    if (this.tabs !== undefined) {
      this.tabs.reset()
    }
  }

  public showActionSelector(groups: ActionGroup[]) {
    if (this.tabs !== undefined && this.actionSelector === undefined) {
      this.actionSelector = new ActionSelector(groups)
      this.tabs.setFocusTab(this.actionSelector!)
    }
  }

  public selectedAction(): SelectedAction | undefined {
    if (this.actionSelector !== undefined) {
      return this.actionSelector.selected
    }
    return undefined
  }

  public showMovementSelector(target: Entity, queries: Queries, movement: Movement): void {
    if (this.tabs !== undefined && this.movementSelector === undefined) {
      this.hideSelectors()
      this.movementSelector = new MovementSelector(target, queries, movement)
      this.tabs.setFocusTab(this.movementSelector!)
    }
  }

  public selectedMovement(): Path | undefined {
    if (this.movementSelector !== undefined) {
      return this.movementSelector.selected
    }
    return undefined
  }

  public showAttackSelector(target: Entity, queries: Queries, range: number): void {
    if (this.tabs !== undefined && this.attackSelector === undefined) {
      this.hideSelectors()
      this.attackSelector = new AttackSelector(target, queries, range)
      this.tabs.setFocusTab(this.attackSelector!)
    }
  }

  public selectedAttack(): Path | undefined {
    if (this.attackSelector !== undefined) {
      return this.attackSelector.selected
    }
    return undefined
  }

  public showMultipleChoiceSelector(options: MultipleChoiceOption[]): void {
    if (this.tabs !== undefined && this.multipleChoiceSelector === undefined) {
      this.hideSelectors()
      this.multipleChoiceSelector = new MultipleChoiceSelector(options)
      this.tabs.setFocusTab(this.multipleChoiceSelector!)
    }
  }

  public selectedOption(): Entity | undefined {
    if (this.multipleChoiceSelector !== undefined) {
      return this.multipleChoiceSelector.selected
    }
    return undefined
  }

  public hasElement(position: Vector): boolean {
    return (
      (this.isModal &&
        ((this.inventoryTransferModal !== undefined && this.inventoryTransferModal.contains(position)) ||
          (this.multipleChoiceModal !== undefined && this.multipleChoiceModal.contains(position)) ||
          (this.dialogModal !== undefined && this.dialogModal.contains(position)))) ||
      (this.tabs !== undefined && this.tabs.contains(position))
    )
  }
}
