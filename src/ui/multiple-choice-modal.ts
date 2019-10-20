import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'
import { Renderer } from '../renderer/renderer'
import { primary, gray } from '../renderer/palettes'

import { UIElement } from './ui-element'
import { TlbWorld } from '../tlb'

import { WindowDecoration } from './window-decoration'
import { ItemSelector } from './selector'

export interface MultipleChoiseOption {
  entity: Entity
  description: string
}

export class MultipleChoiceModal implements UIElement {
  public closed: boolean = false

  public readonly selector: ItemSelector<{ entity: Entity; description: string }>

  public constructor(private readonly window: WindowDecoration, private readonly options: MultipleChoiseOption[]) {
    this.selector = new ItemSelector(this.options)
  }

  public render(renderer: Renderer) {
    this.window.render(renderer)

    const options = this.options || []

    let y = 0
    options.forEach((option, i) => {
      renderer.text(
        `${i + 1} ${option.description}`,
        this.window.content.topLeft.add(new Vector([0, y])),
        primary[1],
        this.selector.hoveredIndex === i ? gray[1] : undefined
      )
      y++
    })
  }

  public update(world: TlbWorld) {
    this.selector.update(world, this.window.content)
    if (this.selector.selected !== undefined) {
      this.closed = true
    }
  }

  public contains(position: Vector): boolean {
    return this.window.containsVector(position)
  }
}
