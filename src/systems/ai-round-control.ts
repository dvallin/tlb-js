import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { TakeTurnComponent } from '../components/rounds'
import { Queries } from '../renderer/queries'
import { PositionComponent } from '../components/position'
import { Entity } from '../ecs/entity'
import { ScriptComponent } from '../components/script'
import { Vector } from '../spatial'
import { EffectComponent } from '../components/effects'
import { calculateAvailableActions } from '../component-reducers/available-actions'
import { SelectedActionComponent, Movement, Attack, SelectedAction } from '../components/action'
import { Random } from '../random'
import { CharacterStatsComponent } from '../components/character-stats'
import { ActionGroup } from '../ui/action-selector'

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

  public selectAction(world: TlbWorld, entity: Entity, actionGroups: ActionGroup[]) {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    let target = this.findTarget(world, position.position)
    const movementActions: SelectedAction[] = []
    const fightActions: SelectedAction[] = []
    const allActions: SelectedAction[] = []
    for (const group of actionGroups) {
      group.actions
        .filter(action => action.available)
        .map(availableAction => {
          const selectedAction = { entity: group.entity, action: availableAction.action }
          const hasMovement = availableAction.action.subActions.find(s => s.kind === 'movement') !== undefined
          if (hasMovement) {
            movementActions.push(selectedAction)
          }
          const hasAttack = availableAction.action.subActions.find(s => s.kind === 'attack') !== undefined
          if (hasAttack) {
            fightActions.push(selectedAction)
          }
          allActions.push(selectedAction)
        })
    }
    if (target !== undefined) {
      const targetPosition = world.getComponent<PositionComponent>(target, 'position')!
      const dist = targetPosition.position.minus(position.position)
      let selection: SelectedAction
      const canGetCloser = dist.lN() > 1 && movementActions.length > 0
      if (canGetCloser) {
        selection = this.random.pick(movementActions)
      } else if (fightActions.length > 0) {
        selection = this.random.pick(fightActions)
      } else {
        selection = this.random.pick(allActions)
      }
      world.editEntity(entity).withComponent<SelectedActionComponent>('selected-action', {
        skippedActions: 0,
        target,
        currentSubAction: 0,
        selection,
      })
    } else {
      console.log('did not find player')
      this.endTurn(world, entity)
    }
  }

  public takeAction(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent, selectedAction: SelectedActionComponent) {
    const action = selectedAction.selection!.action
    const subActions = action.subActions.length
    if (selectedAction.currentSubAction >= subActions) {
      if (action.cost.costsAll) {
        takeTurn.movements = 0
        takeTurn.actions = 0
      } else {
        takeTurn.movements -= action.cost.movement
        takeTurn.actions -= action.cost.actions
      }
      world.editEntity(entity).removeComponent('selected-action')
    } else {
      const currentAction = action.subActions[selectedAction.currentSubAction]
      console.log(action.name)
      switch (currentAction.kind) {
        case 'movement':
          this.move(world, entity, selectedAction.target!, currentAction)
          break
        case 'attack':
          const bodyPart = this.chooseBodyPart(world, selectedAction.target!)
          this.attack(world, entity, selectedAction.target!, bodyPart!, currentAction)
          break
      }
      selectedAction.currentSubAction++
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

  public attack(world: TlbWorld, entity: Entity, target: Entity, bodyPart: string, attack: Attack) {
    attack.effects.forEach(effect =>
      world.createEntity().withComponent<EffectComponent>('effect', {
        source: entity,
        target: target!,
        value: attack.damage,
        effect,
        bodyPart,
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

  public chooseBodyPart(world: TlbWorld, target: Entity): string {
    const stats = world.getComponent<CharacterStatsComponent>(target, 'character-stats')!

    const aliveBodyParts = Object.keys(stats.current.bodyParts).filter(key => {
      const bodyPart = stats.current.bodyParts[key]
      return bodyPart.health > 0
    })
    return this.random.pick(aliveBodyParts)
  }

  public endTurn(world: TlbWorld, entity: Entity): void {
    world
      .editEntity(entity)
      .removeComponent('take-turn')
      .withComponent('took-turn', {})
  }
}
