import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { TakeTurnComponent, SelectionState } from '../components/rounds'
import { Queries } from '../renderer/queries'
import { PositionComponent } from '../components/position'
import { Entity } from '../ecs/entity'
import { ScriptComponent } from '../components/script'
import { Vector } from '../spatial'
import { calculateAvailableActions } from '../component-reducers/available-actions'
import { Movement, SelectedAction, Attack, Action } from '../components/action'
import { Random } from '../random'
import { ActionGroup } from '../ui/tabs/action-selector'
import { attackTarget } from '../component-reducers/attack-target'

export class AiRoundControl implements TlbSystem {
  public readonly components: ComponentName[] = ['take-turn', 'ai', 'position']

  public constructor(public readonly queries: Queries, public readonly random: Random) {}

  public update(world: TlbWorld, entity: Entity): void {
    const script = world.getComponent<ScriptComponent>(entity, 'script')
    const takeTurn = world.getComponent<TakeTurnComponent>(entity, 'take-turn')!

    const isInAnimation = script !== undefined
    const turnIsOver = takeTurn.acted && takeTurn.moved
    if (!isInAnimation) {
      if (!turnIsOver) {
        if (takeTurn.selectionState === undefined) {
          const availableActions = calculateAvailableActions(world, entity, takeTurn, false)
          this.selectAction(world, entity, takeTurn, availableActions)
        } else {
          this.takeAction(world, entity, takeTurn, takeTurn.selectionState)
        }
      } else {
        this.endTurn(world, entity)
      }
    }
  }

  public selectAction(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent, actionGroups: ActionGroup[]) {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    let target = this.findTarget(world, position.position)

    if (target !== undefined) {
      const targetPosition = world.getComponent<PositionComponent>(target, 'position')!
      const path = this.queries.los(world, position.level, position.position, targetPosition.position, {})

      const movementActions: SelectedAction[] = []
      const fightActions: SelectedAction[] = []
      const allActions: SelectedAction[] = []
      for (const group of actionGroups) {
        group.items
          .filter(action => action.available)
          .map(availableAction => {
            const selectedAction = { entity: group.entity, action: availableAction.action }
            const hasMovement = availableAction.action.subActions.find(s => s.kind === 'movement') !== undefined
            if (hasMovement) {
              movementActions.push(selectedAction)
            }
            const hasAttack =
              availableAction.action.subActions.find(s => path !== undefined && s.kind === 'attack' && s.range >= path.cost) !== undefined
            if (hasAttack) {
              fightActions.push(selectedAction)
            }
            allActions.push(selectedAction)
          })
      }

      const dist = targetPosition.position.minus(position.position)
      let selection: SelectedAction | undefined = undefined
      const canGetCloser = dist.lN() > 1 && movementActions.length > 0
      const isInSight = path !== undefined
      if (canGetCloser) {
        selection = this.random.pick(movementActions)
      } else if (fightActions.length > 0 && isInSight) {
        selection = this.random.pick(fightActions)
      }

      if (selection !== undefined) {
        takeTurn.selectionState = {
          skippedActions: 0,
          target,
          currentSubAction: 0,
          selection,
        }
      } else {
        this.endTurn(world, entity)
      }
    } else {
      this.endTurn(world, entity)
    }
  }

  public takeAction(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent, state: SelectionState) {
    const action = state.selection!.action
    const subActions = action.subActions.length
    if (state.currentSubAction >= subActions) {
      switch (action.cost) {
        case 'action':
          takeTurn.acted = true
          break
        case 'movement':
          takeTurn.moved = true
          break
        default:
          takeTurn.acted = true
          takeTurn.moved = true
          break
      }
      takeTurn.selectionState = undefined
    } else {
      const currentAction = action.subActions[state.currentSubAction]
      switch (currentAction.kind) {
        case 'movement':
          this.move(world, entity, state.target!, currentAction)
          break
        case 'attack':
          this.attack(world, entity, state.target!, action, currentAction)
          break
      }
      state.currentSubAction++
    }
  }

  public move(world: TlbWorld, entity: Entity, target: Entity, movement: Movement) {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const targetPosition = world.getComponent<PositionComponent>(target, 'position')!
    const path = this.queries.shortestPath(world, position.level, position.position, targetPosition.position, {
      maximumCost: movement.range,
      bestEffort: true,
    })
    if (path !== undefined && path.path.length > 0) {
      world.editEntity(entity).withComponent<ScriptComponent>('script', {
        path: path.path,
      })
    }
  }

  public attack(world: TlbWorld, entity: Entity, target: Entity, action: Action, attack: Attack) {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const targetPosition = world.getComponent<PositionComponent>(target!, 'position')!
    const path = this.queries.los(world, position.level, position.position, targetPosition.position, {})
    if (path !== undefined && path.cost <= attack.range) {
      attackTarget(world, this.random, entity, target!, action, attack)
    }
  }

  public findTarget(world: TlbWorld, position: Vector): Entity | undefined {
    let nearestPlayer: Entity | undefined
    let bestDist = Number.MAX_SAFE_INTEGER
    world.getStorage('player').foreach(player => {
      const playerPosition = world.getComponent<PositionComponent>(player, 'position')
      if (playerPosition !== undefined) {
        const dist = position.minus(playerPosition.position).squaredLength()
        if (nearestPlayer === undefined && dist < bestDist) {
          nearestPlayer = player
          bestDist = dist
        }
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
