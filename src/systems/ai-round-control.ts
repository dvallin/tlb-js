import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { TakeTurnComponent } from '../components/rounds'
import { Queries } from '../renderer/queries'
import { PositionComponent } from '../components/position'
import { WorldMapResource, WorldMap } from '../resources/world-map'
import { Entity } from '../ecs/entity'
import { ScriptComponent, Action } from '../components/action'
import { Vector } from '../spatial'

export class AiRoundControl implements TlbSystem {
  public readonly components: ComponentName[] = ['take-turn', 'ai', 'position']

  public constructor(public readonly queries: Queries) {}

  public update(world: TlbWorld, entity: Entity): void {
    const script = world.getComponent<ScriptComponent>(entity, 'script')
    const takeTurn = world.getComponent<TakeTurnComponent>(entity, 'take-turn')!

    const isInAnimation = script !== undefined
    const turnIsOver = takeTurn.actions === 0 && takeTurn.movements === 0
    console.log(takeTurn)
    if (!isInAnimation) {
      if (!turnIsOver) {
        this.doTurn(world, entity, takeTurn)
      } else {
        this.endTurn(world, entity)
      }
    }
  }

  public doTurn(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent) {
    const map: WorldMap = world.getResource<WorldMapResource>('map')

    const position = world.getComponent<PositionComponent>(entity, 'position')!
    let player = this.findTarget(world, map, takeTurn, position.position)

    if (player !== undefined) {
      const playerPosition = world.getComponent<PositionComponent>(player, 'position')!
      const dist = playerPosition.position.minus(position.position)
      if (dist.lN() > 1) {
        const path = this.queries.shortestPath(world, position.position, playerPosition.position, {
          maximumCost: takeTurn.movements,
        })
        if (path !== undefined) {
          console.log('ai move', path)
          takeTurn.movements -= path.cost
          world.editEntity(entity).withComponent<ScriptComponent>('script', {
            actions: path.path.map(p => ({ type: 'move', position: p } as Action)),
          })
        } else {
          console.log('ai move could not reach')
          this.endTurn(world, entity)
        }
      }
    } else {
      console.log('ai could not find')
      this.endTurn(world, entity)
    }
  }

  public findTarget(world: TlbWorld, map: WorldMap, takTurn: TakeTurnComponent, position: Vector): Entity | undefined {
    let player: Entity | undefined
    this.queries.explore(
      world,
      position,
      p => {
        const character = map.getCharacter(p)
        const isPlayer = character !== undefined && world.hasComponent(character, 'player')
        if (isPlayer) {
          player = character
        }
        return isPlayer
      },
      { maximumCost: takTurn.movements * 10 }
    )
    return player
  }

  public endTurn(world: TlbWorld, entity: Entity): void {
    world
      .editEntity(entity)
      .removeComponent('take-turn')
      .withComponent('took-turn', {})
  }
}
