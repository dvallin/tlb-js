import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { TakeTurnComponent } from '../components/rounds'
import { Queries } from '../renderer/queries'
import { PositionComponent } from '../components/position'
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
    if (!isInAnimation) {
      if (!turnIsOver) {
        this.doTurn(world, entity, takeTurn)
      } else {
        this.endTurn(world, entity)
      }
    }
  }

  public doTurn(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent) {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    let target = this.findTarget(world, position.position)

    if (target !== undefined) {
      const targetPosition = world.getComponent<PositionComponent>(target, 'position')!
      const dist = targetPosition.position.minus(position.position)
      if (dist.lN() > 1) {
        const path = this.queries.shortestPath(world, position.position, targetPosition.position, {
          maximumCost: takeTurn.movements,
          bestEffort: true,
        })
        if (path !== undefined) {
          console.log('found path', path)
          takeTurn.movements -= path.cost
          world.editEntity(entity).withComponent<ScriptComponent>('script', {
            actions: path.path.map(p => ({ type: 'move', position: p } as Action)),
          })
        } else {
          console.log('did not find a path')
          this.endTurn(world, entity)
        }
      }
    } else {
      console.log('did not find player')
      this.endTurn(world, entity)
    }
  }

  public findTarget(world: TlbWorld, position: Vector): Entity | undefined {
    let nearestPlayer: Entity | undefined
    let bestDist = Number.MAX_SAFE_INTEGER
    world.getStorage('player').foreach(player => {
      const playerPosition = world.getComponent<PositionComponent>(player, 'position')!
      const dist = position.minus(playerPosition.position).squaredLength()
      if (nearestPlayer === undefined && dist < bestDist) {
        nearestPlayer = player
        bestDist = dist
      }
    })
    return nearestPlayer
  }

  public endTurn(world: TlbWorld, entity: Entity): void {
    world
      .editEntity(entity)
      .removeComponent('take-turn')
      .withComponent('took-turn', {})
  }
}
