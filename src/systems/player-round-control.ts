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
import { SelectedActionComponent, HasActionComponent, Action, Movement, Attack, actions } from '../components/action'
import { UIResource, UI } from '../resources/ui'
import { Path } from '../renderer/astar'
import { KEYS } from 'rot-js'
import { EffectComponent } from '../components/effects'
import { ScriptComponent } from '../components/script'

export class PlayerRoundControl implements TlbSystem {
  public readonly components: ComponentName[] = ['take-turn', 'player', 'position']

  public constructor(public readonly queries: Queries) {}

  public update(world: TlbWorld, entity: Entity): void {
    const script = world.getComponent<ScriptComponent>(entity, 'script')
    const takeTurn = world.getComponent<TakeTurnComponent>(entity, 'take-turn')!

    const isInAnimation = script !== undefined
    if (!isInAnimation) {
      const turnIsOver = takeTurn.actions + takeTurn.movements === 0
      if (!turnIsOver) {
        const availableActions = this.calculateAvailableActions(world, entity, takeTurn)
        this.doTurn(world, entity, takeTurn, availableActions)
      } else {
        this.endTurn(world, entity)
      }
    }
  }

  public doTurn(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent, availableActions: Action[]) {
    const ui = world.getResource<UIResource>('ui')
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const input: Input = world.getResource<InputResource>('input')

    const selectedAction = world.getComponent<SelectedActionComponent>(entity, 'selected-action')
    if (selectedAction === undefined) {
      this.showActionDialog(world, ui, entity, availableActions)
    } else if (selectedAction.action === undefined) {
      this.selectAction(world, ui, selectedAction)
    } else {
      const skip = input.keyPressed.has(KEYS.VK_ESCAPE)
      if (!selectedAction.handledMovement && !selectedAction.skippedMovement) {
        if (skip) {
          selectedAction.skippedMovement = true
        } else {
          if (selectedAction.action.movement !== undefined) {
            selectedAction.handledMovement = this.move(world, input, viewport, map, entity, selectedAction.action.movement)
          } else {
            selectedAction.handledMovement = true
          }
        }
      }
      if (!selectedAction.handledAttack && !selectedAction.skippedAttack) {
        if (skip) {
          selectedAction.skippedAttack = true
        } else {
          if (selectedAction.action.attack !== undefined) {
            selectedAction.handledAttack = this.attack(world, input, viewport, map, entity, selectedAction.action.attack)
          } else {
            selectedAction.handledAttack = true
          }
        }
      }

      if (selectedAction.skippedMovement && selectedAction.skippedAttack) {
        this.clearAction(world, entity)
      } else if (selectedAction.handledMovement && selectedAction.handledAttack) {
        if (selectedAction.action.cost.costsAll) {
          takeTurn.movements = 0
          takeTurn.actions = 0
        } else {
          takeTurn.movements -= selectedAction.action.cost.movement
          takeTurn.actions -= selectedAction.action.cost.actions
        }
        this.clearAction(world, entity)
      }
    }
  }

  public endTurn(world: TlbWorld, entity: Entity): void {
    world
      .editEntity(entity)
      .removeComponent('take-turn')
      .withComponent('took-turn', {})
  }

  public showActionDialog(world: TlbWorld, ui: UI, entity: Entity, availableActions: Action[]) {
    ui.showSelectList(world, availableActions)
    world.editEntity(entity).withComponent<SelectedActionComponent>('selected-action', {
      handledAttack: false,
      handledMovement: false,
      skippedAttack: false,
      skippedMovement: false,
    })
  }

  public clearAction(world: TlbWorld, entity: Entity): void {
    world.editEntity(entity).removeComponent('selected-action')
  }

  public calculateAvailableActions(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent): Action[] {
    const hasActions = world.getComponent<HasActionComponent>(entity, 'has-action')!
    return hasActions.actions.map(a => actions[a]).filter(a => a.cost.actions <= takeTurn.actions && a.cost.movement <= takeTurn.movements)
  }

  public selectAction(world: TlbWorld, ui: UI, selectedAction: SelectedActionComponent) {
    const selection = ui.selectListSelection()
    if (selection !== undefined) {
      selectedAction.action = selection as Action
      ui.hideSelectList(world)
    }
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

  public attack(world: TlbWorld, input: Input, viewport: Viewport, map: WorldMap, entity: Entity, attack: Attack): boolean {
    const range = attack.range
    const path = this.selectAttackPath(world, input, viewport, map, entity, range)
    if (path !== undefined) {
      const hitEnemy = path.path.some(p => {
        const target = map.getCharacter(p)
        const hasEnemy = target !== undefined && target !== entity
        if (hasEnemy) {
          world.createEntity().withComponent<EffectComponent>('effect', {
            source: entity,
            target: target!,
            damage: attack.damage,
          })
        }
        return hasEnemy
      })
      return hitEnemy
    }
    return false
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
