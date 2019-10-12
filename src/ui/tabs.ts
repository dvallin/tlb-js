import { UIElement } from './ui-element'
import { Renderer } from '../renderer/renderer'
import { Vector } from '../spatial'
import { TlbWorld } from '../tlb'
import { Rectangle } from '../geometry/rectangle'
import { Input, InputResource, KeyboardCommand } from '../resources/input'
import { WindowDecoration } from './window-decoration'

export interface TabView {
  render(renderer: Renderer): void
  update(world: TlbWorld): void
}

export type TabsKey = 'actionSelector' | 'movementSelector' | 'attackSelector' | 'inventory' | 'log' | 'overview'

export interface Tab {
  key: TabsKey
  name: string

  shortName: string
  command: KeyboardCommand

  minimized?: TabView
  full?: TabView

  minimizedHint?: TabsKey

  setFull(content: Rectangle): void
  setMinimized(content: Rectangle): void
}

export class Tabs implements UIElement {
  private mainTab: Tab | undefined = undefined
  private minimizedTab: Tab | undefined = undefined

  private readonly mainTabWindow: WindowDecoration
  private readonly minimizedTabWindow: WindowDecoration

  private readonly tabs: Tab[] = []

  private focusTab: Tab | undefined = undefined

  public constructor(mainWindow: Rectangle, minimizedWindow: Rectangle) {
    this.mainTabWindow = new WindowDecoration(mainWindow, 'tabs')
    this.minimizedTabWindow = new WindowDecoration(minimizedWindow, 'tabs')
  }

  public add(tab: Tab) {
    this.tabs.push(tab)
    if (this.mainTab === undefined) {
      this.setTab(tab)
    }
    tab.setFull(this.mainTabWindow.content)
    tab.setMinimized(this.minimizedTabWindow.content)
  }

  public setFocusTab(tab: Tab) {
    this.focusTab = tab
    this.setTab(tab)
    tab.setFull(this.mainTabWindow.content)
    tab.setMinimized(this.minimizedTabWindow.content)
  }

  public reset() {
    this.focusTab = undefined
    this.setTab(this.tabs[0])
  }

  public render(renderer: Renderer): void {
    this.mainTabWindow.render(renderer)
    this.minimizedTabWindow.render(renderer)
    if (this.mainTab !== undefined) {
      this.mainTab.full!.render(renderer)
    }
    if (this.minimizedTab !== undefined) {
      this.minimizedTab.minimized!.render(renderer)
    }
  }

  public update(world: TlbWorld): void {
    const input: Input = world.getResource<InputResource>('input')
    this.mainTabWindow.update(input)
    const tabs = this.focusTab !== undefined ? [this.focusTab, ...this.tabs] : this.tabs
    tabs.forEach(tab => {
      if (input.isActive(tab.command)) {
        this.setTab(tab)
      }
    })

    if (this.mainTab !== undefined) {
      this.mainTab.full!.update(world)
    }

    if (this.minimizedTab !== undefined) {
      this.minimizedTab.minimized!.update(world)
    }
  }

  public contains(position: Vector): boolean {
    return this.mainTabWindow.containsVector(position)
  }

  private setTab(tab: Tab) {
    this.mainTab = tab
    const tabs = this.focusTab !== undefined ? [this.focusTab, ...this.tabs] : this.tabs
    this.minimizedTab = tabs.find(t => t.key === tab.minimizedHint) || tab
    this.mainTabWindow.title = tabs
      .map(tab => {
        if (this.mainTab === tab) {
          return tab.name
        }
        return tab.shortName
      })
      .join('/')
    this.minimizedTabWindow.title = this.minimizedTab.name
  }
}
