import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'
import { Renderer } from '../renderer/renderer'
import { primary, gray } from '../renderer/palettes'

import { UIElement } from './ui-element'
import { TlbWorld } from '../tlb'

import { WindowDecoration } from './window-decoration'
import { HitChance } from '../component-reducers/calculate-hit-chance'
import { renderBodyPartInfo, renderPercentage } from './render-helpers'
import { CharacterStatsComponent } from '../components/character-stats'
import { ActiveEffectsComponent } from '../components/effects'
import { Selector, ItemSelector, SelectorState, updateSelectorState } from './selector'
import { Rectangle } from '../geometry/rectangle'

export interface BodyPartInfo {
  name: string
  hitChance: HitChance
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
  private readonly selectorState: SelectorState
  public readonly bodyPartSelector: ItemSelector<BodyPartInfo>

  public constructor(public readonly entity: Entity, private readonly state: State) {
    this.selectorState = { focused: true, firstRow: 0, hovered: 0, selected: undefined }
    this.bodyPartSelector = new ItemSelector(this.selectorState, this.state.bodyParts)
  }

  public static build(entity: Entity, bounds: Rectangle, target: Entity, bodyParts: BodyPartInfo[]): BodyPartSelector {
    const width = Math.floor(bounds.width / 2)
    const bodyPartWindow = new WindowDecoration(new Rectangle(bounds.left, bounds.top, width, bounds.height), 'body parts')
    const descriptionWindow = new WindowDecoration(
      new Rectangle(bodyPartWindow.right, bounds.top, bounds.width - width, bounds.height),
      'description'
    )

    return new BodyPartSelector(entity, {
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
    updateSelectorState(world, this.selectorState, this.state.bodyPartWindow.content, this.length)
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
    this.state.bodyParts.forEach(line => {
      renderer.text(
        line.name,
        this.state.bodyPartWindow.topLeft.add(new Vector([1, row + 1])),
        primary[1],
        this.selectorState.hovered === row ? gray[1] : undefined
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

      renderPercentage(renderer, topLeft.add(new Vector([0, row])), 'Hit', hovered.hitChance.hitChance)
      row++

      renderPercentage(renderer, topLeft.add(new Vector([0, row])), 'Crit', hovered.hitChance.critChance)
    }
  }

  public contains(position: Vector): boolean {
    return this.state.bodyPartWindow.containsVector(position) || this.state.descriptionWindow.containsVector(position)
  }
}
