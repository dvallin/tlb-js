import { Display } from 'rot-js'

import { gray } from './palettes'
import { Position } from './position'
import { Color } from './color'

import { Viewport, ViewportResource } from '../resources/viewport'
import { TlbWorld } from '../tlb'
import { getFeature, Feature } from '../components/feature'
import { PositionComponent } from '../components/position'
import { Entity } from '../ecs/entity'
import { WorldMapResource } from '../resources/world-map'
import { LightingComponent } from '../components/light'
import { OverlayComponent } from '../components/overlay'
import { UI, UIResource } from '../resources/ui'
import { Vector } from '../spatial'

export interface Renderer {
  render(world: TlbWorld): void

  boundaries: Vector

  clear(): void
  eventToPosition(e: UIEvent): Position | undefined

  character(character: string, position: Position, fg: Color, bg?: Color): void
  text(text: string, position: Position, fg: Color, bg?: Color): void
  flowText(text: string, position: Position, width: number, fg: Color, bg?: Color): number
}

export class RotRenderer implements Renderer {
  public constructor(public readonly display: Display, public ambientColor: Color) {}

  public get boundaries(): Vector {
    return new Vector([this.display.getOptions().width, this.display.getOptions().height])
  }

  public static createAndMount(
    root: HTMLElement,
    displayOptions = {
      width: 80,
      height: 50,
      forceSquareRatio: true,
      fontSize: 16,
      fontFamily: 'Monaco, monospace',
      bg: gray[4].toRgb(),
    }
  ): RotRenderer {
    const ambientColor = new Color([200, 120, 120])
    const display = new Display(displayOptions)

    root.appendChild(display.getContainer() as Node)
    return new RotRenderer(display, ambientColor)
  }

  public clear(): void {
    this.display.clear()
  }

  public render(world: TlbWorld): void {
    this.clear()
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    viewport.collectRenderables(world).forEach(({ entity, centered }) => {
      if (entity !== undefined) {
        this.renderEntity(world, viewport, entity, centered)
      }
    })
    const ui: UI = world.getResource<UIResource>('ui')
    ui.render(this)
    world.getStorage<LightingComponent>('lighting')!.foreach(({}, lighting) => {
      const tmp = lighting.incomingLight
      lighting.incomingLight = lighting.incomingLightInFrame
      lighting.incomingLightInFrame = tmp
      lighting.incomingLightInFrame.clear()
    })
    world.components.get('overlay')!.clear()
  }

  public renderEntity(world: TlbWorld, viewport: Viewport, entity: Entity, centered: boolean): void {
    const feature = getFeature(world, entity)
    const position = world.getComponent<PositionComponent>(entity, 'position')
    if (feature && position) {
      this.renderFeature(world, viewport, entity, centered, feature, position)
    }
  }

  public renderFeature(
    world: TlbWorld,
    viewport: Viewport,
    entity: Entity,
    centered: boolean,
    feature: Feature,
    position: PositionComponent
  ): void {
    const level = world.getResource<WorldMapResource>('map').levels[position.level]
    const p = position.position
    if (level.isDiscovered(p)) {
      let lighting = undefined
      if (level.isVisible(p)) {
        lighting = world.getComponent<LightingComponent>(entity, 'lighting')
      }
      const overlay = world.getComponent<OverlayComponent>(entity, 'overlay') || { background: undefined }
      const displayPosition = viewport.toDisplay(p, centered)
      this.character(
        feature.character,
        displayPosition,
        this.computeColor(this.ambientColor, feature.diffuse, lighting),
        overlay.background
      )
    }
  }

  public computeColor(ambientLight: Color, diffuse: Color, lighting: LightingComponent | undefined): Color {
    if (lighting === undefined) {
      return diffuse.multiply(ambientLight)
    } else {
      let totalLight = ambientLight
      lighting.incomingLight.forEach(incoming => {
        totalLight = totalLight.add(incoming)
      })
      return diffuse.multiply(totalLight)
    }
  }

  public eventToPosition(e: TouchEvent | MouseEvent): Position | undefined {
    const p = this.display.eventToPosition(e) as [number, number]
    if (typeof p === 'object') {
      return { x: p[0], y: p[1] }
    }
    return undefined
  }

  public character(character: string, position: Position, fg: Color, bg?: Color): void {
    const fgRgb = fg.toRgb()
    const bgRgb = bg ? bg.toRgb() : undefined
    this.display.draw(position.x, position.y, character[0], fgRgb, bgRgb || null)
  }

  public text(text: string, position: Position, fg: Color, bg?: Color): void {
    const fgRgb = fg.toRgb()
    const bgRgb = bg ? bg.toRgb() : undefined
    for (let idx = 0; idx < text.length; idx++) {
      this.display.draw(position.x + idx, position.y, text[idx], fgRgb, bgRgb || null)
    }
  }

  public flowText(text: string, position: Position, width: number, fg: Color, bg?: Color): number {
    const fgTag = `%c{${fg.toRgb()}}`
    const bgTag = bg ? `%b{${bg.toRgb()}}` : ''
    return this.display.drawText(position.x, position.y, `${fgTag}${bgTag}${text}`, width)
  }
}
