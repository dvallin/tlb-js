import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { TakeTurnComponent, SelectionState } from '../components/rounds'
import { Queries } from '../renderer/queries'
import { WorldMapResource, WorldMap } from '../resources/world-map'
import { InputResource, Input } from '../resources/input'
import { Viewport, ViewportResource } from '../resources/viewport'
import { Entity } from '../ecs/entity'
import { Movement, Attack, Status, Action } from '../components/action'
import { UIResource, UI } from '../resources/ui'
import { ScriptComponent } from '../components/script'
import { calculateAvailableActions } from '../component-reducers/available-actions'
import { ActionGroup } from '../ui/tabs/action-selector'
import { Random } from '../random'
import { attackTarget } from '../component-reducers/attack-target'
import { EffectComponent } from '../components/effects'
import { CharacterStatsComponent } from '../components/character-stats'
import { MultipleChoiceOption } from '../ui/multiple-choice-modal'
import { ItemComponent } from '../components/items'
import { consumeItem } from '../component-reducers/consume-item'
import { items } from '../assets/items'
import { Distribution } from '../random/distributions'

export class PlayerRoundControl implements TlbSystem {
  public readonly components: ComponentName[] = ['take-turn', 'player', 'position']
  private readonly random: Random

  public constructor(public readonly queries: Queries, public rng: Distribution) {
    this.random = new Random(rng)
  }

  public update(world: TlbWorld, entity: Entity): void {
    const script = world.getComponent<ScriptComponent>(entity, 'script')
    const takeTurn = world.getComponent<TakeTurnComponent>(entity, 'take-turn')!
    const isInAnimation = script !== undefined
    if (!isInAnimation) {
      const turnIsOver = takeTurn.acted && takeTurn.moved
      if (!turnIsOver) {
        const availableActions = calculateAvailableActions(world, entity, takeTurn, true)
        this.doTurn(world, entity, takeTurn, availableActions)
      } else {
        this.endTurn(world, entity)
      }
    }
  }

  public doTurn(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent, availableActions: ActionGroup[]) {
    const ui: UI = world.getResource<UIResource>('ui')
    const input: Input = world.getResource<InputResource>('input')

    if (takeTurn.selectionState === undefined) {
      ui.showActionSelector(availableActions)
      takeTurn.selectionState = {
        currentSubAction: 0,
        skippedActions: 0,
      }
    } else if (takeTurn.selectionState.selection === undefined) {
      const selection = ui.selectedAction()
      if (selection !== undefined) {
        takeTurn.selectionState.selection = selection
        ui.hideSelectors()
      }
    } else {
      const skip = input.isActive('cancel')
      const action = takeTurn.selectionState.selection!.action
      const subActionCount = action.subActions.length
      const allDone = takeTurn.selectionState.currentSubAction >= subActionCount
      if (!allDone) {
        if (skip) {
          takeTurn.selectionState.currentSubAction += 1
          takeTurn.selectionState.skippedActions += 1
        } else {
          const currentSubAction = action.subActions[takeTurn.selectionState.currentSubAction]
          const done = this.handleSubAction(world, entity, action, currentSubAction, takeTurn.selectionState)
          if (done) {
            takeTurn.selectionState.currentSubAction += 1
          }
        }
      } else {
        const action = takeTurn.selectionState.selection!.action
        const noActionsOrAtLeastOneActionTaken = subActionCount == 0 || subActionCount - takeTurn.selectionState.skippedActions > 0
        if (noActionsOrAtLeastOneActionTaken) {
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
        }
        takeTurn.selectionState = undefined
      }
    }
  }

  public handleSubAction(
    world: TlbWorld,
    entity: Entity,
    action: Action,
    subAction: Movement | Attack | Status,
    state: SelectionState
  ): boolean {
    switch (subAction.kind) {
      case 'attack':
        if (state.target === undefined) {
          state.target = this.findTarget(world, entity, subAction)
          return false
        } else {
          this.attackTarget(world, entity, state.target!, action, subAction)
          state.target = undefined
          return true
        }
      case 'movement':
        return this.move(world, entity, subAction)
      case 'status':
        return this.status(world, entity, subAction, state.selection!.entity)
    }
  }

  public endTurn(world: TlbWorld, entity: Entity): void {
    world
      .editEntity(entity)
      .removeComponent('take-turn')
      .withComponent('took-turn', {})
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

  public attackTarget(world: TlbWorld, entity: Entity, target: Entity, action: Action, attack: Attack): void {
    attackTarget(world, this.random, entity, target!, action, attack)
  }

  public status(world: TlbWorld, entity: Entity, status: Status, item: Entity): boolean {
    const stats = world.getComponent<CharacterStatsComponent>(entity, 'character-stats')!
    const ui = world.getResource<UIResource>('ui')
    let index: number | undefined = 0
    if (status.effects.find(e => !e.global)) {
      const options: MultipleChoiceOption[] = Object.keys(stats.current.bodyParts).map((key, i) => ({ entity: i, description: key }))
      ui.showMultipleChoiceSelector(options)
      index = ui.selectedOption()
    }
    if (index !== undefined) {
      const bodyPart = Object.keys(stats.current.bodyParts)[index]
      status.effects.forEach(effect => {
        const bodyParts = effect.global ? undefined : [bodyPart]
        world.createEntity().withComponent<EffectComponent>('effect', {
          source: entity,
          target: entity,
          effect,
          bodyParts,
        })
      })
      const itemComponent = world.getComponent<ItemComponent>(item, 'item')
      if (itemComponent !== undefined && items[itemComponent.type].kind === 'consumable') {
        consumeItem(world, entity, item)
      }
      return true
    }
    return false
  }
}
