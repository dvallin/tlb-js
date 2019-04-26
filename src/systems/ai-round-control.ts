import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { TakeTurnComponent } from '../components/rounds'
import { Queries } from '../renderer/queries'
import { PositionComponent } from '../components/position'
import { Entity } from '../ecs/entity'
import { ScriptComponent } from '../components/script'
import { Vector } from '../spatial'
import { EffectComponent } from '../components/effects'
import { calculateAvailableActions } from '../component-reducers/available-actions'
import { Action, SelectedActionComponent, Movement, Attack } from '../components/action'
import { Random } from '../random'

export class AiRoundControl implements TlbSystem {
  public readonly components: ComponentName[] = ['take-turn', 'ai', 'position']

  public constructor(public readonly queries: Queries, public readonly random: Random) {}

  public update(world: TlbWorld, entity: Entity): void {
    const script = world.getComponent<ScriptComponent>(entity, 'script')
    const takeTurn = world.getComponent<TakeTurnComponent>(entity, 'take-turn')!

    const isInAnimation = script !== undefined
    const turnIsOver = takeTurn.actions === 0 && takeTurn.movements === 0
    if (!isInAnimation) {
      if (!turnIsOver) {
        const selectedAction = world.getComponent<SelectedActionComponent>(entity, 'selected-action')
        if (selectedAction === undefined) {
          const availableActions = calculateAvailableActions(world, entity, takeTurn)
          this.selectAction(world, entity, availableActions)
        } else {
          this.takeAction(world, entity, takeTurn, selectedAction)
        }
      } else {
        this.endTurn(world, entity)
      }
    }
  }

  public selectAction(world: TlbWorld, entity: Entity, availableActions: Action[]) {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    let target = this.findTarget(world, position.position)
    const movementActions = availableActions.filter(a => a.subActions.find(s => s.kind === 'movement'))
    const fightActions = availableActions.filter(a => a.subActions.find(s => s.kind === 'attack'))
    if (target !== undefined) {
      const targetPosition = world.getComponent<PositionComponent>(target, 'position')!
      const dist = targetPosition.position.minus(position.position)
      let action
      const canGetCloser = dist.lN() > 1 && movementActions.length > 0
      if (canGetCloser) {
        action = this.random.pick(movementActions)
      } else if (fightActions.length > 0) {
        action = this.random.pick(fightActions)
      } else {
        action = this.random.pick(availableActions)
      }
      world
        .editEntity(entity)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, target, currentSubAction: 0, action })
    } else {
      console.log('did not find player')
      this.endTurn(world, entity)
    }
  }

  public takeAction(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent, selectedAction: SelectedActionComponent) {
    const subActions = selectedAction.action!.subActions.length
    if (selectedAction.currentSubAction >= subActions) {
      if (selectedAction.action!.cost.costsAll) {
        takeTurn.movements = 0
        takeTurn.actions = 0
      } else {
        takeTurn.movements -= selectedAction.action!.cost.movement
        takeTurn.actions -= selectedAction.action!.cost.actions
      }
      world.editEntity(entity).removeComponent('selected-action')
    } else {
      const currentAction = selectedAction.action!.subActions[selectedAction.currentSubAction]
      switch (currentAction.kind) {
        case 'movement':
          this.move(world, entity, selectedAction.target!, currentAction)
          break
        case 'attack':
          this.attack(world, entity, selectedAction.target!, currentAction)
          break
      }
    }
  }

  public move(world: TlbWorld, entity: Entity, target: Entity, movement: Movement) {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const targetPosition = world.getComponent<PositionComponent>(target, 'position')!
    const path = this.queries.shortestPath(world, position.position, targetPosition.position, {
      maximumCost: movement.range,
      bestEffort: true,
    })
    if (path !== undefined && path.path.length > 0) {
      world.editEntity(entity).withComponent<ScriptComponent>('script', {
        path: path.path,
      })
    }
  }

  public attack(world: TlbWorld, entity: Entity, target: Entity, attack: Attack) {
    attack.effects.forEach(effect =>
      world.createEntity().withComponent<EffectComponent>('effect', {
        source: entity,
        target: target!,
        value: attack.damage,
        effect,
      })
    )
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
