import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { TakeTurnComponent } from '../components/rounds'
import { Queries } from '../renderer/queries'
import { WorldMapResource, WorldMap } from '../resources/world-map'
import { InputResource, Input } from '../resources/input'
import { Viewport, ViewportResource } from '../resources/viewport'
import { Entity } from '../ecs/entity'
import { SelectedActionComponent, Movement, Attack, Status } from '../components/action'
import { UIResource, UI } from '../resources/ui'
import { ScriptComponent } from '../components/script'
import { calculateAvailableActions } from '../component-reducers/available-actions'
import { ActionGroup } from '../ui/tabs/action-selector'
import { Random } from '../random'
import { attackTarget } from '../component-reducers/attack-target'
import { EffectComponent } from '../components/effects'

export class PlayerRoundControl implements TlbSystem {
  public readonly components: ComponentName[] = ['take-turn', 'player', 'position']

  public constructor(public readonly queries: Queries, public readonly random: Random) {}

  public update(world: TlbWorld, entity: Entity): void {
    const script = world.getComponent<ScriptComponent>(entity, 'script')
    const takeTurn = world.getComponent<TakeTurnComponent>(entity, 'take-turn')!
    const isInAnimation = script !== undefined
    if (!isInAnimation) {
      const turnIsOver = takeTurn.actions + takeTurn.movements === 0
      if (!turnIsOver) {
        const availableActions = calculateAvailableActions(world, entity, takeTurn)
        this.doTurn(world, entity, takeTurn, availableActions)
      } else {
        this.endTurn(world, entity)
      }
    }
  }

  public doTurn(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent, availableActions: ActionGroup[]) {
    const ui: UI = world.getResource<UIResource>('ui')
    const input: Input = world.getResource<InputResource>('input')

    const selectedAction = world.getComponent<SelectedActionComponent>(entity, 'selected-action')
    if (selectedAction === undefined) {
      ui.showActionSelector(availableActions)
      world.editEntity(entity).withComponent<SelectedActionComponent>('selected-action', {
        currentSubAction: 0,
        skippedActions: 0,
      })
    } else if (selectedAction.selection === undefined) {
      const selection = ui.selectedAction()
      if (selection !== undefined) {
        selectedAction.selection = selection
        ui.hideSelectors()
      }
    } else {
      const skip = input.isActive('cancel')
      const action = selectedAction.selection!.action
      const subActionCount = action.subActions.length
      const allDone = selectedAction.currentSubAction >= subActionCount
      if (!allDone) {
        if (skip) {
          selectedAction.currentSubAction += 1
          selectedAction.skippedActions += 1
        } else {
          const currentSubAction = action.subActions[selectedAction.currentSubAction]
          const done = this.handleSubAction(world, entity, currentSubAction, selectedAction)
          if (done) {
            selectedAction.currentSubAction += 1
          }
        }
      } else {
        const action = selectedAction.selection!.action
        const noActionsOrAtLeastOneActionTaken = subActionCount == 0 || subActionCount - selectedAction.skippedActions > 0
        if (noActionsOrAtLeastOneActionTaken) {
          if (action.cost.costsAll) {
            takeTurn.movements = 0
            takeTurn.actions = 0
          } else {
            takeTurn.movements -= action.cost.movement
            takeTurn.actions -= action.cost.actions
          }
        }
        this.clearAction(world, entity)
      }
    }
  }

  public handleSubAction(
    world: TlbWorld,
    entity: Entity,
    subAction: Movement | Attack | Status,
    selectedAction: SelectedActionComponent
  ): boolean {
    switch (subAction.kind) {
      case 'attack':
        if (selectedAction.target === undefined) {
          selectedAction.target = this.findTarget(world, entity, subAction)
          return false
        } else {
          return this.attackTarget(world, entity, subAction, selectedAction.target!)
        }
      case 'movement':
        return this.move(world, entity, subAction)
      case 'status':
        return this.status(world, entity, subAction)
    }
  }

  public endTurn(world: TlbWorld, entity: Entity): void {
    world
      .editEntity(entity)
      .removeComponent('take-turn')
      .withComponent('took-turn', {})
  }

  public clearAction(world: TlbWorld, entity: Entity): void {
    world.editEntity(entity).removeComponent('selected-action')
  }

  public move(world: TlbWorld, entity: Entity, movement: Movement): boolean {
    const ui = world.getResource<UIResource>('ui')
    ui.showMovementSelector(entity, this.queries, movement)
    const path = ui.selectedMovement()
    if (path !== undefined) {
      ui.hideSelectors()
      world.editEntity(entity).withComponent<ScriptComponent>('script', {
        path: path.path,
      })
      return true
    }
    return false
  }

  public findTarget(world: TlbWorld, entity: Entity, attack: Attack): Entity | undefined {
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const ui = world.getResource<UIResource>('ui')
    ui.showAttackSelector(entity, this.queries, attack.range)
    const path = ui.selectedAttack()
    if (path !== undefined) {
      for (let i = 0; i < path.path.length; ++i) {
        const region = map.levels[viewport.level]
        let target = region.getCharacter(path.path[i])
        const hasEnemy = target !== undefined && target !== entity
        if (hasEnemy) {
          ui.hideSelectors()
          return target
        }
      }
    }
    return undefined
  }

  public attackTarget(world: TlbWorld, entity: Entity, attack: Attack, target: Entity): boolean {
    attackTarget(world, this.random, entity, target!, attack)
    return true
  }

  public status(world: TlbWorld, entity: Entity, status: Status): boolean {
    status.effects.forEach(effect => {
      world.createEntity().withComponent<EffectComponent>('effect', {
        source: entity,
        target: entity,
        effect,
      })
    })
    return true
  }
}
