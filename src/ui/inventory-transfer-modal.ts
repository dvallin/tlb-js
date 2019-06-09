import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'
import { Renderer } from '../renderer/renderer'
import { primary, gray } from '../renderer/palettes'

import { UIElement } from './ui-element'
import { TlbWorld } from '../tlb'

import { WindowDecoration } from './window-decoration'
import { HitChance } from '../component-reducers/calculate-hit-chance'
import { InputResource, Input } from '../resources/input'
import { KEYS } from 'rot-js'
import { dropAt } from '../array-utils'
import { InventoryDescription, createInventoryDescription } from '../component-reducers/inventory-description'

export interface BodyPartInfo {
  name: string
  hitChance: HitChance
}

export interface State {
  leftWindow: WindowDecoration
  rightWindow: WindowDecoration

  left: Entity
  right: Entity

  leftInventory?: InventoryDescription
  rightInventory?: InventoryDescription

  leftActive: boolean
  hovered: number
}

export class InventoryTransferModal implements UIElement {
  public closed: boolean = false

  public constructor(public readonly entity: Entity, private readonly state: State) {}

  public render(renderer: Renderer) {
    const { leftWindow, rightWindow, leftInventory, rightInventory, leftActive, hovered } = this.state
    this.renderInventory(renderer, leftWindow, leftInventory!, leftActive ? hovered : undefined)
    this.renderInventory(renderer, rightWindow, rightInventory!, leftActive ? undefined : hovered)
  }

  public renderInventory(renderer: Renderer, window: WindowDecoration, inventory: InventoryDescription, hovered: number | undefined) {
    window.render(renderer)

    const inventoryItems = inventory.items || []

    let y = 0
    inventoryItems.forEach(item => {
      renderer.text(
        `${item.name} (${item.weight})`,
        window.content.topLeft.add(new Vector([1, y])),
        primary[1],
        hovered === y ? gray[1] : undefined
      )
      y++
    })

    if (inventory.maximumWeight !== undefined) {
      const text = `${inventory.currentWeight}/${inventory.maximumWeight}`
      renderer.text(text, window.content.bottomRight.add(new Vector([-text.length, 1])), primary[1])
    }
  }

  public update(world: TlbWorld) {
    this.state.leftInventory = createInventoryDescription(world, this.state.left)
    this.state.rightInventory = createInventoryDescription(world, this.state.right)

    const input: Input = world.getResource<InputResource>('input')
    let position
    if (input.position) {
      position = new Vector([input.position.x, input.position.y])
    }

    if (input.keyPressed.has(KEYS.VK_ESCAPE)) {
      this.closed = true
    }

    const up = input.keyPressed.has(KEYS.VK_K)
    const down = input.keyPressed.has(KEYS.VK_J)
    const right = input.keyPressed.has(KEYS.VK_L)
    const left = input.keyPressed.has(KEYS.VK_H)
    if (up) {
      this.state.hovered--
    }
    if (down) {
      this.state.hovered++
    }
    if (right || left) {
      this.state.leftActive = !this.state.leftActive
    }
    const source = this.state.leftActive ? this.state.leftInventory : this.state.rightInventory
    const target = this.state.leftActive ? this.state.rightInventory : this.state.leftInventory
    if (source.inventory.content.length > 0) {
      this.state.hovered += source.inventory.content.length
      this.state.hovered %= source.inventory.content.length
    } else {
      this.state.leftActive = !this.state.leftActive
      this.state.hovered = 0
    }

    let selected: Entity | undefined = undefined
    if (input.keyPressed.has(KEYS.VK_RETURN)) {
      selected = this.state.hovered
    }
    if (position) {
      const mouseInLeft = this.state.leftWindow.content.containsVector(position)
      const mouseInRight = this.state.rightWindow.content.containsVector(position)
      if (mouseInLeft || mouseInRight) {
        this.state.leftActive = mouseInLeft
        let delta
        if (mouseInLeft) {
          delta = position.minus(this.state.leftWindow.content.topLeft)
        } else {
          delta = position.minus(this.state.rightWindow.content.topLeft)
        }
        if (input.mousePressed) {
          selected = delta.y
        }
        this.state.hovered = delta.y
      }
    }

    if (selected !== undefined) {
      this.transfer(source!, target!, selected)
    }
  }

  public transfer(source: InventoryDescription, target: InventoryDescription, index: number) {
    const item = source.items[index]
    if (item !== undefined && (target.maximumWeight === undefined || target.currentWeight + item.weight <= target.maximumWeight)) {
      target.inventory.content.push(source.inventory.content[index])
      dropAt(source.inventory.content, index)
    }
  }

  public contains(position: Vector): boolean {
    return this.state.leftWindow.containsVector(position) || this.state.rightWindow.containsVector(position)
  }
}
