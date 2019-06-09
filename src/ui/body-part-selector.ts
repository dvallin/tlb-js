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
import { renderBodyPartInfo, renderPercentage } from './render-helpers'
import { CharacterStatsComponent } from '../components/character-stats'
import { ActiveEffectsComponent } from '../components/effects'

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

  selected: number | undefined
  hovered: number
}

export class BodyPartSelector implements UIElement {
  public constructor(public readonly entity: Entity, private readonly state: State) {}

  public render(renderer: Renderer) {
    this.renderBodyParts(renderer)
    this.renderDescription(renderer)
  }

  public update(world: TlbWorld) {
    const input: Input = world.getResource<InputResource>('input')
    let position
    if (input.position) {
      position = new Vector([input.position.x, input.position.y])
    }
    const up = input.keyPressed.has(KEYS.VK_K)
    const down = input.keyPressed.has(KEYS.VK_J)
    if (up) {
      this.state.hovered--
    }
    if (down) {
      this.state.hovered++
    }
    this.state.hovered += this.state.bodyParts.length
    this.state.hovered %= this.state.bodyParts.length

    this.state.selected = undefined
    const content = this.state.bodyPartWindow.content
    if (position && content.containsVector(position)) {
      const delta = position.minus(content.topLeft)
      const line = Math.min(delta.y, this.state.bodyParts.length - 1)
      this.state.hovered = line
      if (input.mousePressed) {
        this.state.selected = line
      }
    }

    if (input.keyPressed.has(KEYS.VK_RETURN)) {
      this.state.selected = this.state.hovered
    }

    this.state.activeEffects = world.getComponent<ActiveEffectsComponent>(this.state.target, 'active-effects')
    this.state.stats = world.getComponent<CharacterStatsComponent>(this.state.target, 'character-stats')
  }

  public get selectedBodyPart(): string | undefined {
    if (this.state.selected !== undefined) {
      return this.state.bodyParts[this.state.selected].name
    }
    return undefined
  }

  private renderBodyParts(renderer: Renderer) {
    this.state.bodyPartWindow.render(renderer)
    let row = 0
    this.state.bodyParts.forEach(line => {
      renderer.text(
        line.name,
        this.state.bodyPartWindow.topLeft.add(new Vector([1, row + 1])),
        primary[1],
        this.state.hovered === row ? gray[1] : undefined
      )
      row++
    })
  }

  private renderDescription(renderer: Renderer) {
    this.state.descriptionWindow.render(renderer)
    const line = this.state.bodyParts[this.state.hovered]
    const topLeft = this.state.descriptionWindow.content.topLeft
    let row = 0

    renderBodyPartInfo(renderer, topLeft, line.name, this.state.stats!, this.state.activeEffects!)
    row++

    renderPercentage(renderer, topLeft.add(new Vector([0, row])), 'Hit', line.hitChance.hitChance)
    row++

    renderPercentage(renderer, topLeft.add(new Vector([0, row])), 'Crit', line.hitChance.critChance)
  }

  public contains(position: Vector): boolean {
    return this.state.bodyPartWindow.containsVector(position) || this.state.descriptionWindow.containsVector(position)
  }
}
