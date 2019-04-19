import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { TakeTurnComponent } from '../components/rounds'
import { Queries } from '../renderer/queries'
import { PositionComponent } from '../components/position'
import { Entity } from '../ecs/entity'
import { ScriptComponent } from '../components/script'
import { Vector } from '../spatial'
import { EffectComponent } from '../components/effects'

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
      const canGetCloaser = dist.lN() > 1 && takeTurn.movements > 0
      if (canGetCloaser) {
        const path = this.queries.shortestPath(world, position.position, targetPosition.position, {
          maximumCost: takeTurn.movements,
          bestEffort: true,
        })
        if (path !== undefined && path.path.length > 0) {
          console.log(entity, 'found path', path.path.map(p => p.key), targetPosition.position.key)
          takeTurn.movements -= path.cost
          world.editEntity(entity).withComponent<ScriptComponent>('script', {
            path: path.path,
          })
        } else {
          console.log('did not find a path')
          this.endTurn(world, entity)
        }
      } else if (takeTurn.actions > 0) {
        world.createEntity().withComponent<EffectComponent>('effect', {
          source: entity,
          target: target,
          damage: 3,
        })
        takeTurn.actions -= 1
        this.endTurn(world, entity)
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
