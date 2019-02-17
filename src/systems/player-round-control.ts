import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { TakeTurnComponent } from '../components/rounds'
import { Queries } from '../renderer/queries'
import { PositionComponent } from '../components/position'
import { OverlayComponent } from '../components/overlay'
import { WorldMapResource, WorldMap } from '../resources/world-map'
import { primary } from '../renderer/palettes'
import { InputResource, Input } from '../resources/input'
import { Viewport, ViewportResource } from '../resources/viewport'

export class PlayerRoundControl implements TlbSystem {
  public readonly components: ComponentName[] = ['take-turn', 'player', 'position']

  public constructor(public readonly queries: Queries) {}

  public update(world: TlbWorld, entity: number): void {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const input: Input = world.getResource<InputResource>('input')
    const takeTurn = world.getComponent<TakeTurnComponent>(entity, 'take-turn')!
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    if (input.position !== undefined) {
      const path = this.queries.shortestPath(world, position.position, viewport.fromDisplay(input.position), {
        maximumDepth: takeTurn.movements,
        onlyDiscovered: true,
      })
      if (path !== undefined) {
        path.forEach(position => {
          const tile = map.getTile(position)!
          world.editEntity(tile).withComponent<OverlayComponent>('overlay', { background: primary[3] })
        })
      }
    }
  }
}
