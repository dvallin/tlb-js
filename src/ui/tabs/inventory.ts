import { Renderer } from '../../renderer/renderer'
import { Vector } from '../../spatial'
import { Entity } from '../../ecs/entity'
import { TlbWorld } from '../../tlb'
import { primary, gray } from '../../renderer/palettes'
import { InputResource, Input, KeyboardCommand } from '../../resources/input'
import { Rectangle } from '../../geometry/rectangle'
import { createInventoryDescription, InventoryDescription, ItemWithEntity } from '../../component-reducers/inventory-description'
import { ItemSelector } from '../selector'
import { EquipedItemsComponent, ItemComponent } from '../../components/items'
import { CharacterStatsComponent } from '../../components/character-stats'
import { dropAt } from '../../array-utils'

import { items } from '../../assets/items'
import { Tab, TabView, TabsKey } from '../tabs'
import { Button } from '../button'

export interface State {
  focus: Entity
  inventory?: InventoryDescription
}

export class FullInventoryView implements TabView {
  private readonly state: State

  private selectedItemIndex: number | undefined

  public readonly itemSelector: ItemSelector<ItemWithEntity>
  private readonly button: Button

  public constructor(public readonly content: Rectangle, focus: Entity) {
    this.state = { focus }
    this.button = new Button(0, this.content.bottomLeft)
    this.itemSelector = new ItemSelector([])
  }

  public render(renderer: Renderer): void {
    if (this.state.inventory !== undefined) {
      const inventory = this.state.inventory
      if (this.selectedItemIndex === undefined) {
        this.renderInventory(renderer, inventory, this.itemSelector.hoveredIndex)
      } else {
        this.renderDescription(renderer, inventory, this.selectedItemIndex)
      }
    }
  }

  public renderInventory(renderer: Renderer, inventory: InventoryDescription, hovered: number | undefined) {
    const inventoryItems = inventory.items || []

    let y = 0
    inventoryItems.forEach(item => {
      renderer.text(
        `${y + 1} ${item.item.name}`,
        this.content.topLeft.add(new Vector([0, y])),
        primary[1],
        hovered === y ? gray[1] : undefined
      )
      y++
    })

    if (inventory.maximumWeight !== undefined) {
      renderer.text(`weight: ${inventory.currentWeight}/${inventory.maximumWeight}`, this.content.bottomLeft, primary[1])
    }
  }

  public renderDescription(renderer: Renderer, inventory: InventoryDescription, index: number) {
    const entity = inventory.inventory.content[index]
    const inventoryItems = inventory.items || []
    const inventoryItem = inventoryItems[index]
    let y = 0
    if (inventoryItem !== undefined) {
      const item = inventoryItem.item
      y += renderer.flowText(`${item.description}`, this.content.topLeft.add(new Vector([0, y])), this.content.width, primary[1])
      y += renderer.flowText(
        'actions: ' + item.actions.join(', '),
        this.content.topLeft.add(new Vector([0, y])),
        this.content.width,
        primary[1]
      )

      if (item.attachments > 0) {
        const attachement = inventory.equipment.find(e => e.entity === entity)
        const equipText = attachement !== undefined ? 'unequip' : 'equip'
        this.button.setText(equipText)
        this.button.render(renderer)
      }
    }
  }

  public update(world: TlbWorld): void {
    if (this.selectedItemIndex === undefined) {
      this.state.inventory = createInventoryDescription(world, this.state.focus)
      this.itemSelector.setItems(this.state.inventory.items)
      this.itemSelector.update(world, this.content)

      const item = this.itemSelector.selected
      if (item !== undefined) {
        this.selectedItemIndex = this.itemSelector.selectedIndex
      }
    } else {
      const input: Input = world.getResource<InputResource>('input')
      if (input.isActive('cancel')) {
        this.selectedItemIndex = undefined
      } else {
        this.button.update(world)
        if (this.button.clicked) {
          this.equip(world)
        }
      }
    }
  }

  private equip(world: TlbWorld) {
    const inventory = this.state.inventory!
    const item = inventory.inventory.content[this.selectedItemIndex!]
    const inventoryItems = inventory.items || []
    const hoveredItem = inventoryItems[this.selectedItemIndex!].item
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

export class MinimizedInventoryView implements TabView {
  private readonly state: State
  private readonly inventoryContent: Rectangle

  public constructor(public readonly content: Rectangle, focus: Entity) {
    const width = Math.floor(content.width / 2)
    this.inventoryContent = new Rectangle(content.left, content.top, width, content.height)
    this.state = { focus }
  }

  public render(renderer: Renderer): void {
    if (this.state.inventory !== undefined) {
      const inventory = this.state.inventory
      this.renderInventory(renderer, this.inventoryContent, inventory)
    }
  }

  public renderInventory(renderer: Renderer, content: Rectangle, inventory: InventoryDescription) {
    const inventoryItems = inventory.items || []

    let y = 0
    inventoryItems.forEach(item => {
      renderer.text(`${item.item.name}`, content.topLeft.add(new Vector([0, y])), primary[1])
      y++
    })

    if (inventory.maximumWeight !== undefined) {
      renderer.text(
        `inventory (${inventory.currentWeight}/${inventory.maximumWeight})`,
        content.topLeft.add(new Vector([0, y])),
        primary[1]
      )
    }
  }

  public update(world: TlbWorld): void {
    this.state.inventory = createInventoryDescription(world, this.state.focus)
  }
}

export class Inventory implements Tab {
  public readonly key: TabsKey = 'inventory'
  public name: string = 'inventory'
  public readonly shortName: string = 'i'
  public readonly command: KeyboardCommand = 'inventory'

  public readonly minimizedHint: TabsKey = 'overview'

  public full: FullInventoryView | undefined
  public minimized: MinimizedInventoryView | undefined

  public constructor(public readonly focus: Entity) {}

  public setFull(content: Rectangle): void {
    this.full = new FullInventoryView(content, this.focus)
  }

  public setMinimized(content: Rectangle): void {
    this.minimized = new MinimizedInventoryView(content, this.focus)
  }
}
