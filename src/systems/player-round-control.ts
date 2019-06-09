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
import { SelectedActionComponent, Movement, Attack, Status } from '../components/action'
import { UIResource, UI } from '../resources/ui'
import { Path } from '../renderer/astar'
import { KEYS } from 'rot-js'
import { ScriptComponent } from '../components/script'
import { calculateAvailableActions } from '../component-reducers/available-actions'
import { ActionGroup } from '../ui/action-selector'
import { Random } from '../random'
import { attackTarget } from '../component-reducers/attack-target'
import { EffectComponent } from '../components/effects'
import { CharacterStatsComponent } from '../components/character-stats'
import { BodyPartInfo } from '../ui/body-part-selector'
import { calculateHitChance } from '../component-reducers/calculate-hit-chance'

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
    const ui = world.getResource<UIResource>('ui')
    const input: Input = world.getResource<InputResource>('input')

    const selectedAction = world.getComponent<SelectedActionComponent>(entity, 'selected-action')
    if (selectedAction === undefined) {
      this.showActionDialog(world, ui, entity, availableActions)
    } else if (selectedAction.selection === undefined) {
      this.selectAction(world, ui, selectedAction)
    } else {
      const skip = input.keyPressed.has(KEYS.VK_ESCAPE)
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
        console.log('payed ', JSON.stringify(takeTurn), noActionsOrAtLeastOneActionTaken)
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
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const input: Input = world.getResource<InputResource>('input')
    const ui: UI = world.getResource<UIResource>('ui')
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    switch (subAction.kind) {
      case 'attack':
        if (selectedAction.target === undefined) {
          selectedAction.target = this.findTarget(world, input, viewport, map, entity, subAction)
          if (selectedAction.target !== undefined) {
            this.showBodyPartDialog(world, ui, entity, selectedAction.target, subAction)
          }
          return false
        } else {
          return this.attackTarget(world, ui, entity, subAction, selectedAction.target!)
        }
      case 'movement':
        return this.move(world, input, viewport, map, entity, subAction)
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

  public showActionDialog(world: TlbWorld, ui: UI, entity: Entity, availableActions: ActionGroup[]) {
    ui.showActionSelector(world, availableActions)
    world.editEntity(entity).withComponent<SelectedActionComponent>('selected-action', {
      currentSubAction: 0,
      skippedActions: 0,
    })
  }

  public showBodyPartDialog(world: TlbWorld, ui: UI, entity: Entity, target: Entity, attack: Attack) {
    const stats = world.getComponent<CharacterStatsComponent>(target, 'character-stats')!
    const bodyParts: BodyPartInfo[] = []
    Object.keys(stats.current.bodyParts).forEach(name => {
      const hitChance = calculateHitChance(world, entity, target, name, attack)
      bodyParts.push({ name, hitChance })
    })
    ui.showBodyPartSelector(world, target, bodyParts)
  }

  public clearAction(world: TlbWorld, entity: Entity): void {
    world.editEntity(entity).removeComponent('selected-action')
  }

  public selectAction(world: TlbWorld, ui: UI, selectedAction: SelectedActionComponent) {
    const selection = ui.selectedAction()
    if (selection !== undefined) {
      selectedAction.selection = selection
      ui.hideActionSelector(world)
    }
  }

  public selectBodyPart(world: TlbWorld, ui: UI): string | undefined {
    const bodyPart = ui.selectedBodyPart()
    if (bodyPart !== undefined) {
      ui.hideBodyPartSelector(world)
    }
    return bodyPart
  }

  public move(world: TlbWorld, input: Input, viewport: Viewport, map: WorldMap, entity: Entity, movement: Movement): boolean {
    const path = this.selectMovementPath(world, input, viewport, map, entity, movement)
    if (path !== undefined) {
      world.editEntity(entity).withComponent<ScriptComponent>('script', {
        path: path.path,
      })
      return true
    }
    return false
  }

  public findTarget(world: TlbWorld, input: Input, viewport: Viewport, map: WorldMap, entity: Entity, attack: Attack): Entity | undefined {
    const range = attack.range
    const path = this.selectAttackPath(world, input, viewport, map, entity, range)
    if (path !== undefined) {
      for (let i = 0; i < path.path.length; ++i) {
        let target = map.getCharacter(path.path[i])
        const hasEnemy = target !== undefined && target !== entity
        if (hasEnemy) {
          return target
        }
      }
    }
    return undefined
  }

  public attackTarget(world: TlbWorld, ui: UI, entity: Entity, attack: Attack, target: Entity): boolean {
    const bodyPart = this.selectBodyPart(world, ui)
    if (bodyPart !== undefined) {
      attackTarget(world, this.random, entity, target!, bodyPart, attack)
      return true
    }
    return false
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

  public selectMovementPath(
    world: TlbWorld,
    input: Input,
    viewport: Viewport,
    map: WorldMap,
    entity: Entity,
    movement: Movement
  ): Path | undefined {
    if (input.position !== undefined) {
      const cursor = viewport.fromDisplay(input.position)
      const position = world.getComponent<PositionComponent>(entity, 'position')!
      const path = this.queries.shortestPath(world, position.position, cursor, {
        maximumCost: movement.range,
        onlyDiscovered: true,
      })
      if (path !== undefined) {
        path.path.forEach(position => {
          const tile = map.getTile(position)!
          world.editEntity(tile).withComponent<OverlayComponent>('overlay', { background: primary[2] })
        })

        if (input.mousePressed) {
          return path
        }
      }
    }
    return undefined
  }

  public selectAttackPath(
    world: TlbWorld,
    input: Input,
    viewport: Viewport,
    map: WorldMap,
    entity: Entity,
    range: number
  ): Path | undefined {
    if (input.position !== undefined) {
      const cursor = viewport.fromDisplay(input.position)
      const position = world.getComponent<PositionComponent>(entity, 'position')!
      const path = this.queries.ray(world, position.position, cursor, { maximumCost: range })
      if (path !== undefined) {
        path.path.forEach(p => {
          const target = map.getCharacter(p)
          const hasEnemy = target !== undefined && target !== entity
          if (hasEnemy) {
            world.editEntity(target!).withComponent<OverlayComponent>('overlay', { background: primary[3] })
          } else {
            const tile = map.getTile(p)!
            world.editEntity(tile).withComponent<OverlayComponent>('overlay', { background: primary[1] })
          }
        })

        if (input.mousePressed) {
          return path
        }
      }
    }
    return undefined
  }
}
