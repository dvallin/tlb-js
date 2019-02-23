import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { TakeTurnComponent } from '../components/rounds'
import { Queries } from '../renderer/queries'
import { PositionComponent } from '../components/position'
import { OverlayComponent } from '../components/overlay'
import { WorldMapResource, WorldMap } from '../resources/world-map'
import { primary } from '../renderer/palettes'
import { InputResource, Input } from '../resources/input'
import { Viewport, ViewportResource } from '../resources/viewport'
import { Entity } from '../ecs/entity'
import { ScriptComponent, Action } from '../components/action'
import { Vector } from '../spatial'
import { InfoPopupComponent } from '../components/info-popup'

export class PlayerRoundControl implements TlbSystem {
  public readonly components: ComponentName[] = ['take-turn', 'player', 'position']

  public constructor(public readonly queries: Queries) {}

  public update(world: TlbWorld, entity: Entity): void {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const input: Input = world.getResource<InputResource>('input')
    const script = world.getComponent<ScriptComponent>(entity, 'script')

    if (input.position !== undefined && script === undefined) {
      const cursor = viewport.fromDisplay(input.position)

      const enemy = map.getCharacter(cursor)
      if (enemy !== undefined) {
        this.handleAttack(world, input, entity, enemy)
      } else {
        this.handleMovement(world, map, input, entity, cursor)
      }
    }
  }

  public handleAttack(world: TlbWorld, input: Input, entity: number, enemy: Entity): void {
    world.editEntity(enemy).withComponent<OverlayComponent>('overlay', { background: primary[3] })
    if (input.mousePressed) {
      world.editEntity(enemy).withComponent<InfoPopupComponent>('info-popup', {
        availableActions: [
          {
            description: 'melee',
            callback: () => this.doAttack(world, entity, enemy, 4),
          },
        ],
      })
    }
  }

  public doAttack({  }: TlbWorld, entity: Entity, enemy: Entity, damage: number): void {
    console.log(`entity ${entity} does ${damage} damage to ${enemy}`)
  }

  public handleMovement(world: TlbWorld, map: WorldMap, input: Input, entity: number, cursor: Vector): void {
    const takeTurn = world.getComponent<TakeTurnComponent>(entity, 'take-turn')!
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const path = this.queries.shortestPath(world, position.position, cursor, {
      maximumCost: takeTurn.movements,
      onlyDiscovered: true,
    })
    if (path !== undefined) {
      path.path.forEach(position => {
        const tile = map.getTile(position)!
        world.editEntity(tile).withComponent<OverlayComponent>('overlay', { background: primary[2] })
      })

      if (input.mousePressed) {
        takeTurn.movements -= path.cost
        world.editEntity(entity).withComponent<ScriptComponent>('script', {
          actions: path.path.map(p => ({ type: 'move', position: p } as Action)),
        })
      }
    }
  }
}
