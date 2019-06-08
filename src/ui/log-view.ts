import { UIElement } from './ui-element'
import { Renderer } from '../renderer/renderer'
import { Vector } from '../spatial'
import { Entity } from '../ecs/entity'
import { TlbWorld } from '../tlb'
import { WindowDecoration } from './window-decoration'
import { Rectangle } from '../geometry/rectangle'
import { LogResource, Log } from '../resources/log'
import { primary } from '../renderer/palettes'

export interface State {
  window: WindowDecoration
  entries: string[]
}

export class LogView implements UIElement {
  private readonly state: State

  public constructor(public readonly entity: Entity, rect: Rectangle) {
    const window = new WindowDecoration(rect, 'log')
    const entries: string[] = []
    this.state = {
      window,
      entries,
    }
  }

  public render(renderer: Renderer): void {
    this.state.window.render(renderer)
    this.state.entries.forEach((entry, index) => {
      renderer.text(entry, this.state.window.topLeft.add(new Vector([1, index + 1])), primary[1])
    })
  }

  public update(world: TlbWorld): void {
    const log: Log = world.getResource<LogResource>('log')
    this.state.entries = log.getEntries(0, this.state.window.content.height)
  }

  public contains(position: Vector): boolean {
    return this.state.window.containsVector(position)
  }
}
