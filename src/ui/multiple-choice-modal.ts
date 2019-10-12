import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'
import { Renderer } from '../renderer/renderer'
import { primary, gray } from '../renderer/palettes'

import { UIElement } from './ui-element'
import { TlbWorld } from '../tlb'

import { WindowDecoration } from './window-decoration'
import { InputResource, Input } from '../resources/input'
import { ItemSelector } from './selector'

export interface State {
  window: WindowDecoration
  options: { entity: Entity; description: string }[]
}

export class MultipleChoiceModal implements UIElement {
  public closed: boolean = false

  public readonly selector: ItemSelector<{ entity: Entity; description: string }>

  public constructor(private readonly state: State) {
    this.selector = new ItemSelector(this.state.options)
  }

  public render(renderer: Renderer) {
    this.state.window.render(renderer)

    const options = this.state.options || []

    let y = 0
    options.forEach((option, i) => {
      renderer.text(
        `${i + 1} ${option.description}`,
        this.state.window.content.topLeft.add(new Vector([0, y])),
        primary[1],
        this.selector.hoveredIndex === y ? gray[1] : undefined
      )
      y++
    })
  }

  public update(world: TlbWorld) {
    this.selector.update(world, this.state.window.content)

    const input: Input = world.getResource<InputResource>('input')
    if (input.isActive('accept')) {
      this.closed = true
    }
    if (this.selector.selected !== undefined) {
      this.closed = true
    }
  }

  public contains(position: Vector): boolean {
    return this.state.window.containsVector(position)
  }
}
