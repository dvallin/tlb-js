import { Renderer } from '../../renderer/renderer'
import { primary } from '../../renderer/palettes'

import { TlbWorld } from '../../tlb'

import { Rectangle } from '../../geometry/rectangle'
import { Selector } from '../selector'
import { Tab, TabView, TabsKey } from '../tabs'
import { InputResource, Input, KeyboardCommand } from '../../resources/input'
import { Path } from '../../renderer/astar'
import { ViewportResource, Viewport } from '../../resources/viewport'
import { WorldMapResource, WorldMap } from '../../resources/world-map'
import { Queries } from '../../renderer/queries'
import { Entity } from '../../ecs/entity'
import { PositionComponent } from '../../components/position'
import { OverlayComponent } from '../../components/overlay'

export class AttackSelectorFullView implements TabView, Selector<Path> {
  private isSelected: boolean = false
  private path: Path | undefined

  public constructor(
    public readonly content: Rectangle,
    private target: Entity,
    private readonly queries: Queries,
    private readonly range: number
  ) {}

  public render(_renderer: Renderer) {}

  public get selected(): Path | undefined {
    if (this.isSelected) {
      return this.path
    }
    return undefined
  }

  public get hovered(): Path | undefined {
    return this.path
  }

  public get length(): number {
    return this.path === undefined ? 0 : this.path.cost
  }

  public update(world: TlbWorld) {
    const input: Input = world.getResource<InputResource>('input')
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    if (input.position !== undefined) {
      const cursor = viewport.fromDisplay(input.position)
      const position = world.getComponent<PositionComponent>(this.target, 'position')!
      const path = this.queries.ray(world, position.level, position.position, cursor, { maximumCost: this.range })
      if (path !== undefined) {
        const level = map.levels[position.level]
        path.path.forEach(p => {
          const target = level.getCharacter(p)
          const hasEnemy = target !== undefined && target !== this.target
          if (hasEnemy) {
            world.editEntity(target!).withComponent<OverlayComponent>('overlay', { background: primary[3] })
          } else {
            const tile = level.getTile(p)!
            world.editEntity(tile).withComponent<OverlayComponent>('overlay', { background: primary[1] })
          }
        })

        this.path = path
        if (input.mousePressed) {
          this.isSelected = input.mousePressed
        }
      }
    }
  }
}

export class AttackSelector implements Tab, Selector<Path> {
  public readonly key: TabsKey = 'attackSelector'
  public readonly name: string = 'select an enemy target'
  public readonly shortName: string = 'q'
  public readonly command: KeyboardCommand = 'focus'

  public readonly minimizedHint: TabsKey = 'overview'

  public full: AttackSelectorFullView | undefined
  public minimized: AttackSelectorFullView | undefined

  public constructor(private target: Entity, private readonly queries: Queries, private readonly range: number) {}

  public setFull(content: Rectangle): void {
    this.full = new AttackSelectorFullView(content, this.target, this.queries, this.range)
  }

  public setMinimized(content: Rectangle): void {
    this.minimized = new AttackSelectorFullView(content, this.target, this.queries, this.range)
  }

  public get selected(): Path | undefined {
    if (this.full === undefined) {
      return undefined
    }
    return this.full.selected
  }

  public get hovered(): Path | undefined {
    if (this.full === undefined) {
      return undefined
    }
    return this.full.hovered
  }

  public get length(): number {
    return 1
  }
}
