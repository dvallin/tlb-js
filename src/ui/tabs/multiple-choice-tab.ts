import { Vector } from '../../spatial'
import { Renderer } from '../../renderer/renderer'
import { primary, gray } from '../../renderer/palettes'

import { TlbWorld } from '../../tlb'

import { Rectangle } from '../../geometry/rectangle'
import { Selector, ItemSelector } from '../selector'
import { Tab, TabView, TabsKey } from '../tabs'
import { KeyboardCommand } from '../../resources/input'
import { Entity } from '../../ecs/entity'
import { MultipleChoiceOption } from '../multiple-choice-modal'

export class MultipleChoiceFullView implements TabView, Selector<Entity> {
  public closed: boolean = false

  public readonly selector: ItemSelector<Entity>

  public constructor(private readonly content: Rectangle, private readonly options: MultipleChoiceOption[]) {
    this.selector = new ItemSelector(this.options.map(o => o.entity))
  }

  public get selected(): Entity | undefined {
    return this.selector.selected
  }

  public get hovered(): Entity | undefined {
    return this.selector.hovered
  }

  public get length(): number {
    return this.options.length
  }

  public render(renderer: Renderer) {
    const options = this.options || []

    let y = 0
    options.forEach((option, i) => {
      renderer.text(
        `${i + 1} ${option.description}`,
        this.content.topLeft.add(new Vector([0, y])),
        primary[1],
        this.selector.hoveredIndex === i ? gray[1] : undefined
      )
      y++
    })
  }

  public update(world: TlbWorld) {
    this.selector.update(world, this.content)
  }
}

export class MultipleChoiceSelector implements Tab, Selector<Entity> {
  public readonly key: TabsKey = 'actionSelector'
  public readonly name: string = 'select your move'
  public readonly shortName: string = 'q'
  public readonly command: KeyboardCommand = 'focus'

  public readonly minimizedHint: TabsKey = 'overview'

  public full: MultipleChoiceFullView | undefined
  public minimized: MultipleChoiceFullView | undefined

  public constructor(private readonly options: MultipleChoiceOption[]) {}

  public setFull(content: Rectangle): void {
    this.full = new MultipleChoiceFullView(content, this.options)
  }

  public setMinimized(content: Rectangle): void {
    this.minimized = new MultipleChoiceFullView(content, this.options)
  }

  public get selected(): Entity | undefined {
    if (this.full === undefined) {
      return undefined
    }
    return this.full.selected
  }

  public get hovered(): Entity | undefined {
    if (this.full === undefined) {
      return undefined
    }
    return this.full.hovered
  }

  public get length(): number {
    if (this.full === undefined) {
      return 0
    }
    return this.full.length
  }
}
