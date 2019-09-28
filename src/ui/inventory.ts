import { UIElement } from './ui-element'
import { Renderer } from '../renderer/renderer'
import { Vector } from '../spatial'
import { Entity } from '../ecs/entity'
import { TlbWorld } from '../tlb'
import { primary, gray } from '../renderer/palettes'
import { InputResource, Input } from '../resources/input'
import { WindowDecoration } from './window-decoration'
import { Rectangle } from '../geometry/rectangle'
import { createInventoryDescription, InventoryDescription } from '../component-reducers/inventory-description'
import { SelectorState, updateSelectorState } from './selector'
import { EquipedItemsComponent, ItemComponent } from '../components/items'
import { CharacterStatsComponent } from '../components/character-stats'
import { dropAt } from '../array-utils'

import { items } from '../assets/items'

export interface State {
  window: WindowDecoration
  focus: Entity

  inventoryContent: Rectangle
  descriptionContent: Rectangle

  inventory?: InventoryDescription
}

export interface ButtonState {
  bounds: Rectangle
  clicked: boolean
  hovered: boolean
}

export class Inventory implements UIElement {
  private readonly state: State
  private readonly selectorState: SelectorState
  private readonly buttonState: ButtonState

  public constructor(public readonly entity: Entity, focus: Entity, bounds: Rectangle) {
    const window = new WindowDecoration(bounds, 'inventory', true)
    const width = Math.floor(bounds.width / 2)
    const inventoryContent = new Rectangle(bounds.left, bounds.top, width, bounds.height).shrink()
    const descriptionContent = new Rectangle(inventoryContent.right, bounds.top, bounds.width - width, bounds.height).shrink()

    this.state = { focus, window, inventoryContent, descriptionContent }
    this.buttonState = {
      bounds: new Rectangle(descriptionContent.left, descriptionContent.bottom, descriptionContent.width, 1),
      clicked: false,
      hovered: false,
    }
    this.selectorState = {
      focused: false,
      firstRow: 0,
      hovered: 0,
      selected: undefined,
    }
  }

  public render(renderer: Renderer): void {
    if (!this.state.window.collapsed) {
      if (this.state.inventory !== undefined) {
        const inventory = this.state.inventory
        const hovered = this.selectorState.focused ? this.selectorState.hovered : undefined
        this.renderInventory(renderer, this.state.inventoryContent, inventory, hovered)
        if (hovered !== undefined) {
          this.renderDescription(renderer, this.state.descriptionContent, inventory, hovered)
        }

        if (inventory.maximumWeight !== undefined) {
          this.state.window.title = `inventory (${inventory.currentWeight}/${inventory.maximumWeight})`
        }
      }
      const x = this.state.window.content.center.x
      for (let y = this.state.window.content.top; y <= this.state.window.content.bottom; y++) {
        renderer.character('|', { x, y }, primary[1])
      }
    }
    this.state.window.render(renderer)
  }

  public renderInventory(renderer: Renderer, content: Rectangle, inventory: InventoryDescription, hovered: number | undefined) {
    const inventoryItems = inventory.items || []

    let y = 0
    inventoryItems.forEach(item => {
      renderer.text(`${item.name}`, content.topLeft.add(new Vector([1, y])), primary[1], hovered === y ? gray[1] : undefined)
      y++
    })
  }

  public renderDescription(renderer: Renderer, content: Rectangle, inventory: InventoryDescription, hovered: number) {
    const entity = inventory.inventory.content[hovered]
    const inventoryItems = inventory.items || []
    const hoveredItem = inventoryItems[hovered]
    let y = 0
    if (hoveredItem !== undefined) {
      y += renderer.flowText(`${hoveredItem.description}`, content.topLeft.add(new Vector([1, y])), content.width, primary[1])
      y += renderer.flowText(
        'actions: ' + hoveredItem.actions.join(', '),
        content.topLeft.add(new Vector([1, y])),
        content.width,
        primary[1]
      )

      if (hoveredItem.attachments > 0) {
        const attachement = inventory.equipment.find(e => e.entity === entity)
        const equipText = attachement !== undefined ? 'unequip' : 'equip'
        const position = content.bottomLeft.add(new Vector([1, 0]))
        renderer.text(equipText, position, primary[1], this.buttonState.hovered ? gray[1] : undefined)
        this.buttonState.bounds = new Rectangle(position.x, position.y, equipText.length, 1)
      }
    }
  }

  public update(world: TlbWorld): void {
    const input: Input = world.getResource<InputResource>('input')
    this.state.window.update(input)
    this.state.inventory = createInventoryDescription(world, this.state.focus)
    updateSelectorState(world, this.selectorState, this.state.inventoryContent, this.state.inventory!.items.length)
    let position: Vector | undefined
    if (input.position) {
      position = new Vector([input.position.x, input.position.y])
      this.buttonState.hovered = this.buttonState.bounds.containsVector(position)
      if (this.buttonState.hovered && input.mousePressed) {
        this.buttonState.clicked = true
      } else {
        this.buttonState.clicked = false
      }
    } else {
      this.buttonState.hovered = false
      this.buttonState.clicked = false
    }

    if (this.buttonState.clicked) {
      const inventory = this.state.inventory
      const hovered = this.selectorState.hovered
      const item = inventory.inventory.content[hovered]
      const inventoryItems = inventory.items || []
      const hoveredItem = inventoryItems[hovered]
      if (hoveredItem.attachments > 0) {
        const equipped = world.getComponent<EquipedItemsComponent>(this.state.focus, 'equiped-items')!

        const attachementIndex = inventory.equipment.findIndex(e => e.entity === item)
        if (attachementIndex >= 0) {
          dropAt(equipped.equipment, attachementIndex)
        } else {
          const stats = world.getComponent<CharacterStatsComponent>(this.state.focus, 'character-stats')!
          const possibleBodyParts: string[] = []
          Object.keys(stats.current.bodyParts).forEach(key => {
            const bodyPart = stats.current.bodyParts[key]
            bodyPart.itemAttachments.filter(kind => kind === hoveredItem.kind).forEach(() => possibleBodyParts.push(key))
          })

          equipped.equipment.forEach(e => {
            const equipedItem = world.getComponent<ItemComponent>(e.entity, 'item')!
            if (items[equipedItem.type].kind === hoveredItem.kind) {
              e.bodyParts.forEach(part => {
                const index = possibleBodyParts.findIndex(p => p === part)
                if (index >= 0) {
                  dropAt(possibleBodyParts, index)
                }
              })
            }
          })

          const availableBodyParts = new Set(possibleBodyParts)
          if (availableBodyParts.size >= hoveredItem.attachments) {
            const bodyParts: string[] = []
            availableBodyParts.forEach(part => {
              if (bodyParts.length < hoveredItem.attachments) {
                bodyParts.push(part)
              }
            })
            equipped.equipment.push({
              entity: item,
              bodyParts,
            })
          }
        }
      }
    }
  }

  public contains(position: Vector): boolean {
    return this.state.window.containsVector(position)
  }
}
