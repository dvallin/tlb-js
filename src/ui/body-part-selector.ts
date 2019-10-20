import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'
import { Renderer } from '../renderer/renderer'
import { primary, gray } from '../renderer/palettes'

import { UIElement } from './ui-element'
import { TlbWorld } from '../tlb'

import { WindowDecoration } from './window-decoration'
import { renderBodyPartInfo, renderPercentage } from './render-helpers'
import { CharacterStatsComponent } from '../components/character-stats'
import { ActiveEffectsComponent } from '../components/effects'
import { Selector, ItemSelector } from './selector'
import { Rectangle } from '../geometry/rectangle'

export interface BodyPartInfo {
  name: string
  hitChance: number
}

export interface State {
  bodyPartWindow: WindowDecoration
  descriptionWindow: WindowDecoration

  target: Entity
  bodyParts: BodyPartInfo[]

  stats?: CharacterStatsComponent
  activeEffects?: ActiveEffectsComponent
}

export class BodyPartSelector implements UIElement, Selector<string> {
  public readonly bodyPartSelector: ItemSelector<BodyPartInfo>

  public constructor(private readonly state: State) {
    this.bodyPartSelector = new ItemSelector(this.state.bodyParts)
  }

  public static build(bounds: Rectangle, target: Entity, bodyParts: BodyPartInfo[]): BodyPartSelector {
    const width = Math.floor(bounds.width / 2)
    const bodyPartWindow = new WindowDecoration(new Rectangle(bounds.left, bounds.top, width, bounds.height), 'body parts')
    const descriptionWindow = new WindowDecoration(
      new Rectangle(bodyPartWindow.right, bounds.top, bounds.width - width, bounds.height),
      'description'
    )

    return new BodyPartSelector({
      bodyParts,
      bodyPartWindow,
      descriptionWindow,
      target,
    })
  }

  public render(renderer: Renderer) {
    this.renderBodyParts(renderer)
    this.renderDescription(renderer)
  }

  public update(world: TlbWorld) {
    this.bodyPartSelector.update(world, this.state.bodyPartWindow.content)
    this.state.activeEffects = world.getComponent<ActiveEffectsComponent>(this.state.target, 'active-effects')
    this.state.stats = world.getComponent<CharacterStatsComponent>(this.state.target, 'character-stats')
  }

  public get selected(): string | undefined {
    const selection = this.bodyPartSelector.selected
    if (selection !== undefined) {
      return selection.name
    }
    return undefined
  }

  public get hovered(): string | undefined {
    const selection = this.bodyPartSelector.hovered
    if (selection !== undefined) {
      return selection.name
    }
    return undefined
  }

  public get length(): number {
    return this.state.bodyParts.length
  }

  private renderBodyParts(renderer: Renderer) {
    this.state.bodyPartWindow.render(renderer)
    let row = 0
    this.state.bodyParts.forEach((line, i) => {
      renderer.text(
        line.name,
        this.state.bodyPartWindow.topLeft.add(new Vector([1, row + 1])),
        primary[1],
        this.bodyPartSelector.hoveredIndex === i ? gray[1] : undefined
      )
      row++
    })
  }

  private renderDescription(renderer: Renderer) {
    this.state.descriptionWindow.render(renderer)
    const hovered = this.bodyPartSelector.hovered
    if (hovered !== undefined) {
      const topLeft = this.state.descriptionWindow.content.topLeft
      let row = 0

      renderBodyPartInfo(renderer, topLeft, hovered.name, this.state.stats!, this.state.activeEffects!)
      row++

      renderPercentage(renderer, topLeft.add(new Vector([0, row])), 'Hit', hovered.hitChance)
    }
  }

  public contains(position: Vector): boolean {
    return this.state.bodyPartWindow.containsVector(position) || this.state.descriptionWindow.containsVector(position)
  }
}
