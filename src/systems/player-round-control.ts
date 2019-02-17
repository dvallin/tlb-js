import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { TakeTurnComponent } from '../components/rounds'
import { Queries } from '../renderer/queries'
import { PositionComponent } from '../components/position'
import { OverlayComponent } from '../components/overlay'
import { Vector } from '../spatial'
import { WorldMapResource, WorldMap } from '../resources/world-map'
import { primary } from '../renderer/palettes'

export class PlayerRoundControl implements TlbSystem {
  public readonly components: ComponentName[] = ['take-turn', 'player', 'position']

  public constructor(public readonly queries: Queries) {}

  public update(world: TlbWorld, entity: number): void {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const takeTurn = world.getComponent<TakeTurnComponent>(entity, 'take-turn')!
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    this.queries.explore(
      world,
      position.position,
      (target: Vector, {  }: number) => {
        const tile = map.getTile(target)!
        world.editEntity(tile).withComponent<OverlayComponent>('overlay', { background: primary[3] })
      },
      { maximumDepth: takeTurn.movements, onlyDiscovered: true }
    )
  }
}
