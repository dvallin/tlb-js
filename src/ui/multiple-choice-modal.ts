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
import { SelectorState, ItemSelector, updateSelectorState } from './selector'

export interface BodyPartInfo {
  name: string
  hitChance: HitChance
}

export interface State {
  window: WindowDecoration
  options: { entity: Entity; description: string }[]
}

export class MultipleChoiceModal implements UIElement {
  public closed: boolean = false

  private readonly selectorState: SelectorState
  public readonly selector: ItemSelector<{ entity: Entity; description: string }>

  public constructor(public readonly entity: Entity, private readonly state: State) {
    this.selectorState = { focused: true, firstRow: 0, hovered: 0, selected: undefined }
    this.selector = new ItemSelector(this.selectorState, this.state.options)
  }

  public render(renderer: Renderer) {
    this.state.window.render(renderer)

    const options = this.state.options || []

    let y = 0
    options.forEach((option, i) => {
      renderer.text(
        `${option.description} (${i + 1})`,
        this.state.window.content.topLeft.add(new Vector([1, y])),
        primary[1],
        this.selectorState.hovered === y ? gray[1] : undefined
      )
      y++
    })
  }

  public update(world: TlbWorld) {
    updateSelectorState(world, this.selectorState, this.state.window.content, this.state.options.length)

    const input: Input = world.getResource<InputResource>('input')
    if (input.keyPressed.has(KEYS.VK_ESCAPE)) {
      this.closed = true
    }
    if (this.selectorState.selected !== undefined) {
      this.closed = true
    }
  }

  public contains(position: Vector): boolean {
    return this.state.window.containsVector(position)
  }
}
