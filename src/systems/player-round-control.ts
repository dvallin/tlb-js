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
import { ScriptComponent, Action, SelectedActionComponent, DamageComponent } from '../components/action'
import { UIResource, UI } from '../resources/ui'
import { Path } from '../renderer/astar'

export class PlayerRoundControl implements TlbSystem {
  public readonly components: ComponentName[] = ['take-turn', 'player', 'position']

  public constructor(public readonly queries: Queries) {}

  public update(world: TlbWorld, entity: Entity): void {
    const script = world.getComponent<ScriptComponent>(entity, 'script')
    const takeTurn = world.getComponent<TakeTurnComponent>(entity, 'take-turn')!

    const isInAnimation = script !== undefined
    const availableActions = this.calculateAvailableActions(takeTurn)
    const turnIsOver = availableActions.length === 0
    if (!isInAnimation) {
      if (!turnIsOver) {
        this.doTurn(world, entity, takeTurn, availableActions)
      } else {
        this.endTurn(world, entity)
      }
    }
  }

  public doTurn(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent, availableActions: string[]) {
    const ui = world.getResource<UIResource>('ui')
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const input: Input = world.getResource<InputResource>('input')

    const selectedAction = world.getComponent<SelectedActionComponent>(entity, 'selected-action')
    if (selectedAction === undefined) {
      this.showActionDialog(world, ui, entity, availableActions)
    } else if (selectedAction.type === undefined) {
      this.selectAction(world, ui, selectedAction)
    } else {
      switch (selectedAction.type) {
        case 'move':
          this.move(world, input, viewport, map, entity, takeTurn)
          break
        case 'use':
          this.use(world, input, viewport, map, entity, takeTurn, selectedAction)
          break
        case 'end-turn':
          takeTurn.actions = 0
          takeTurn.movements = 0
          this.clearAction(world, entity)
          break
      }
    }
  }

  public endTurn(world: TlbWorld, entity: Entity): void {
    world
      .editEntity(entity)
      .removeComponent('take-turn')
      .withComponent('took-turn', {})
  }

  public showActionDialog(world: TlbWorld, ui: UI, entity: Entity, availableActions: string[]) {
    ui.showSelectList(world, [...availableActions, 'end-turn'])
    world.editEntity(entity).withComponent<SelectedActionComponent>('selected-action', {})
  }

  public clearAction(world: TlbWorld, entity: Entity): void {
    world.editEntity(entity).removeComponent('selected-action')
  }

  public calculateAvailableActions(takeTurn: TakeTurnComponent): string[] {
    const availableActions: string[] = []
    if (takeTurn.movements > 0) {
      availableActions.push('move')
    }
    if (takeTurn.actions > 0) {
      availableActions.push('melee')
      availableActions.push('nail-gun')
    }
    return availableActions
  }

  public selectAction(world: TlbWorld, ui: UI, selectedAction: SelectedActionComponent) {
    const selection = ui.selectListSelection()
    if (selection) {
      switch (selection) {
        case 'move': {
          selectedAction.type = 'move'
          break
        }
        case 'melee': {
          selectedAction.type = 'use'
          selectedAction.using = 0
          break
        }
        case 'nail-gun': {
          selectedAction.type = 'use'
          selectedAction.using = 1
          break
        }
        case 'end-turn': {
          selectedAction.type = 'end-turn'
          break
        }
        default:
          break
      }
      ui.hideSelectList(world)
    }
  }

  public move(world: TlbWorld, input: Input, viewport: Viewport, map: WorldMap, entity: Entity, takeTurn: TakeTurnComponent) {
    const path = this.selectMovementPath(world, input, viewport, map, entity, takeTurn)
    if (path !== undefined) {
      takeTurn.movements -= path.cost
      world.editEntity(entity).withComponent<ScriptComponent>('script', {
        actions: path.path.map(p => ({ type: 'move', position: p } as Action)),
      })
      this.clearAction(world, entity)
    }
  }

  public use(
    world: TlbWorld,
    input: Input,
    viewport: Viewport,
    map: WorldMap,
    entity: Entity,
    takeTurn: TakeTurnComponent,
    selectedAction: SelectedActionComponent
  ) {
    const range = selectedAction.using === 0 ? 1 : 5
    const path = this.selectAttackPath(world, input, viewport, map, entity, range)
    if (path !== undefined) {
      takeTurn.actions -= 1
      path.path.some(p => {
        const target = map.getCharacter(p)
        const hasEnemy = target !== undefined && target !== entity
        if (hasEnemy) {
          world.createEntity().withComponent<DamageComponent>('damage', {
            source: entity,
            target: target!,
            damage: selectedAction.using === 0 ? 10 : 7,
          })
          this.clearAction(world, entity)
        }
        return hasEnemy
      })
    }
  }

  public selectMovementPath(
    world: TlbWorld,
    input: Input,
    viewport: Viewport,
    map: WorldMap,
    entity: Entity,
    takeTurn: TakeTurnComponent
  ): Path | undefined {
    if (input.position !== undefined) {
      const cursor = viewport.fromDisplay(input.position)
      const position = world.getComponent<PositionComponent>(entity, 'position')!
      const path = this.queries.shortestPath(world, position.position, cursor, {
        maximumCost: takeTurn.movements,
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
