import { ResourceName, TlbResource, TlbWorld } from '../tlb'
import { Vector } from '../spatial'
import { Entity } from '../ecs/entity'
import { Difference } from '../geometry/difference'
import { Rectangle } from '../geometry/rectangle'
import { Renderer } from '../renderer/renderer'
import { primary, gray } from '../renderer/palettes'
import { InputResource, Input } from './input'
import { ViewportResource } from './viewport'

export interface UI {
  hasElement(position: Vector): boolean
  render(renderer: Renderer): void

  showSelectList(world: TlbWorld, entries: string[]): void
  selectListSelection(): string | undefined
  hideSelectList(world: TlbWorld): void
}

export interface SelectList {
  entries: string[]
  shape: Rectangle
  element: Entity
  hovered: number | undefined
  selected: number | undefined
}

export class UIResource implements TlbResource, UI {
  public readonly kind: ResourceName = 'ui'

  public visibleElements: Rectangle[] = []

  private selectList: SelectList | undefined = undefined

  public update(world: TlbWorld): void {
    const input: Input = world.getResource<InputResource>('input')
    let position
    if (input.position) {
      position = new Vector(input.position.x, input.position.y)
    }
    this.updateSelectList(position, input.mousePressed)
  }

  public updateSelectList(position: Vector | undefined, pressed: boolean) {
    if (this.selectList !== undefined) {
      this.selectList.hovered = undefined
      this.selectList.selected = undefined
      const content = this.selectList.shape.shrink()
      if (position && content.containsVector(position)) {
        const delta = position.minus(content.topLeft)
        this.selectList.hovered = delta.y
        if (pressed) {
          this.selectList.selected = delta.y
        }
      }
    }
  }

  public render(renderer: Renderer): void {
    this.renderInfoPopup(renderer)
  }

  public renderInfoPopup(renderer: Renderer) {
    if (this.selectList !== undefined) {
      const list = this.selectList
      Difference.innerBorder(list.shape).foreach(p => {
        renderer.character('+', p, primary[0])
      })
      list.entries.forEach((action, index) => {
        renderer.text(action, list.shape.topLeft.add(new Vector(1, index + 1)), primary[0], list.hovered === index ? gray[1] : undefined)
      })
    }
  }

  public showSelectList(world: TlbWorld, entries: string[]) {
    const viewport = world.getResource<ViewportResource>('viewport')
    const height = entries.length + 2
    let element
    if (this.selectList !== undefined) {
      element = this.selectList.element
    } else {
      element = world.createEntity().entity
    }
    const shape = new Rectangle(30, viewport.boundaries.y - height, 20, height)
    this.selectList = { entries, shape, element, hovered: undefined, selected: undefined }
  }

  public hideSelectList(world: TlbWorld) {
    if (this.selectList !== undefined) {
      world.deleteEntity(this.selectList.element)
      this.selectList = undefined
    }
  }

  public selectListSelection(): string | undefined {
    if (this.selectList !== undefined && this.selectList.selected !== undefined) {
      return this.selectList.entries[this.selectList.selected]
    }
    return undefined
  }

  public hasElement(position: Vector): boolean {
    return this.selectList !== undefined && this.selectList.shape!.containsVector(position)
  }
}
