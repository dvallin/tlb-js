import { Display } from 'rot-js'

import { gray } from './palettes'
import { Position } from './position'
import { Color } from './color'

import { Viewport, ViewportResource } from '../resources/viewport'
import { TlbWorld } from '../tlb'
import { getFeature, Feature } from '../components/feature'
import { PositionComponent } from '../components/position'
import { Entity } from '../ecs/entity'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { LightingComponent } from '../components/light'
import { OverlayComponent } from '../components/overlay'
import { UI, UIResource } from '../resources/ui'

export interface Renderer {
  render(world: TlbWorld): void

  clear(): void
  eventToPosition(e: UIEvent): Position | undefined

  character(character: string, position: Position, fg: Color, bg?: Color): void
  text(text: string, position: Position, fg: Color, bg?: Color): void
}

export class RotRenderer implements Renderer {
  public readonly display: Display

  public ambientColor: Color

  public constructor() {
    const displayOptions = {
      width: 60,
      height: 40,
      forceSquareRatio: true,
      fontSize: 17,
      fontFamily: 'Lucida Console, Monaco, monospace',
      bg: gray[4].rgb,
    }
    this.ambientColor = new Color([120, 120, 120])
    this.display = new Display(displayOptions)
    document.body.appendChild(this.display.getContainer() as Node)
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
    world.components.get('lighting')!.clear()
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
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const p = position.position.floor()
    if (map.isDiscovered(p)) {
      let lighting = undefined
      if (map.isVisible(p)) {
        lighting = world.getComponent<LightingComponent>(entity, 'lighting')
      }
      const overlay = world.getComponent<OverlayComponent>(entity, 'overlay') || { background: undefined }
      const displayPosition = viewport.toDisplay(position.position, centered)
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
    const fgRgb = fg.rgb
    const bgRgb = bg ? bg.rgb : undefined
    this.display.draw(position.x, position.y, character[0], fgRgb, bgRgb || null)
  }

  public text(text: string, position: Position, fg: Color, bg?: Color): void {
    const fgRgb = fg.rgb
    const bgRgb = bg ? bg.rgb : undefined
    for (let idx = 0; idx < text.length; idx++) {
      this.display.draw(position.x + idx, position.y, text[idx], fgRgb, bgRgb || null)
    }
  }
}
