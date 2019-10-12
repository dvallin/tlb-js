import { Movement } from '../../components/action'
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
import { FeatureComponent } from '../../components/feature'

export class MovementSelectorFullView implements TabView, Selector<Path> {
  private isSelected: boolean = false
  private path: Path | undefined

  private targetFeature: FeatureComponent | undefined

  public constructor(
    public readonly content: Rectangle,
    private target: Entity,
    private readonly queries: Queries,
    private readonly movement: Movement
  ) {}

  public render(renderer: Renderer) {
    if (this.targetFeature !== undefined) {
      renderer.text(this.targetFeature.feature().name, this.content.topLeft, primary[0])
    }
  }

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
      const region = map.levels[position.level]
      const path = this.queries.shortestPath(world, position.level, position.position, cursor, {
        maximumCost: this.movement.range,
        onlyDiscovered: true,
      })
      if (path !== undefined) {
        path.path.forEach(position => {
          const tile = region.getTile(position)!
          world.editEntity(tile).withComponent<OverlayComponent>('overlay', { background: primary[2] })
        })
      }
      const targetTile = map.levels[position.level].getTile(cursor)
      if (targetTile !== undefined) {
        this.targetFeature = world.getComponent<FeatureComponent>(targetTile, 'feature')
      }
      this.path = path
      if (input.mousePressed) {
        this.isSelected = input.mousePressed
      }
    }
  }
}

export class MovementSelector implements Tab, Selector<Path> {
  public readonly key: TabsKey = 'movementSelector'
  public readonly name: string = 'select a location to move to'
  public readonly shortName: string = 'q'
  public readonly command: KeyboardCommand = 'focus'

  public readonly minimizedHint: TabsKey = 'overview'

  public full: MovementSelectorFullView | undefined
  public minimized: MovementSelectorFullView | undefined

  public constructor(private target: Entity, private readonly queries: Queries, private readonly movement: Movement) {}

  public setFull(content: Rectangle): void {
    this.full = new MovementSelectorFullView(content, this.target, this.queries, this.movement)
  }

  public setMinimized(content: Rectangle): void {
    this.minimized = new MovementSelectorFullView(content, this.target, this.queries, this.movement)
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
