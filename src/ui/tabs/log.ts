import { Renderer } from '../../renderer/renderer'
import { Vector } from '../../spatial'
import { TlbWorld } from '../../tlb'
import { WindowDecoration } from '../window-decoration'
import { Rectangle } from '../../geometry/rectangle'
import { LogResource, Log } from '../../resources/log'
import { primary } from '../../renderer/palettes'
import { Tab, TabView, TabsKey } from '../tabs'
import { KeyboardCommand } from '../../resources/input'

export interface State {
  window: WindowDecoration
  entries: string[]
}

export class LogView implements TabView {
  private entries: string[] = []

  constructor(public readonly content: Rectangle) {}

  public render(renderer: Renderer): void {
    const topLeft = this.content.topLeft
    this.entries.forEach((entry, index) => {
      renderer.text(entry, topLeft.add(new Vector([0, index])), primary[1])
    })
  }

  public update(world: TlbWorld): void {
    const log: Log = world.getResource<LogResource>('log')
    this.entries = log.getEntries(0, this.content.height)
  }
}

export class LogTab implements Tab {
  public readonly key: TabsKey = 'log'
  public readonly name: string = 'log'
  public readonly shortName: string = 'o'
  public readonly command: KeyboardCommand = 'log'

  public readonly minimizedHint: TabsKey = 'overview'

  public full: LogView | undefined
  public minimized: LogView | undefined

  public setFull(content: Rectangle): void {
    this.full = new LogView(content)
  }

  public setMinimized(content: Rectangle): void {
    this.minimized = new LogView(content)
  }
}
