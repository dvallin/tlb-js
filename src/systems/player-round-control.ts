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
import { UIResource } from '../resources/ui'
import { Path } from '../renderer/astar'

export class PlayerRoundControl implements TlbSystem {
  public readonly components: ComponentName[] = ['take-turn', 'player', 'position']

  public constructor(public readonly queries: Queries) {}

  public update(world: TlbWorld, entity: Entity): void {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const input: Input = world.getResource<InputResource>('input')
    const script = world.getComponent<ScriptComponent>(entity, 'script')
    const selectedAction = world.getComponent<SelectedActionComponent>(entity, 'selected-action')
    const takeTurn = world.getComponent<TakeTurnComponent>(entity, 'take-turn')!

    if (script === undefined) {
      const ui = world.getResource<UIResource>('ui')
      if (selectedAction === undefined) {
        this.showActionSelection(world, ui, entity, takeTurn)
      } else if (selectedAction.type === undefined) {
        this.selectActionType(world, ui, selectedAction)
      } else if (selectedAction.type === 'move') {
        const path = this.selectMovementPath(world, input, viewport, map, entity, takeTurn)
        if (path !== undefined) {
          takeTurn.movements -= path.cost
          world
            .editEntity(entity)
            .withComponent<ScriptComponent>('script', {
              actions: path.path.map(p => ({ type: 'move', position: p } as Action)),
            })
            .removeComponent('selected-action')
        }
      } else if (selectedAction.type === 'use') {
        const takeTurn = world.getComponent<TakeTurnComponent>(entity, 'take-turn')!
        const range = selectedAction.using === 0 ? 1 : 5
        const path = this.selectAttackPath(world, input, viewport, map, entity, range)
        if (path !== undefined) {
          takeTurn.actions -= 1
          path.path.some(p => {
            const target = map.getCharacter(p)
            const hasEnemy = target !== undefined && target !== entity
            if (hasEnemy) {
              world
                .createEntity()
                .withComponent<DamageComponent>('damage', { source: entity, target: target!, damage: selectedAction.using === 0 ? 10 : 7 })
            }
            return hasEnemy
          })
          world.editEntity(entity).removeComponent('selected-action')
        }
      }
    }
  }

  public showActionSelection(world: TlbWorld, ui: UIResource, entity: Entity, takeTurn: TakeTurnComponent) {
    const availableActions = []
    if (takeTurn.movements > 0) {
      availableActions.push('move')
    }
    if (takeTurn.actions > 1) {
      availableActions.push('melee')
      availableActions.push('nail gun')
    }
    ui.showSelectList(world, availableActions)
    world.editEntity(entity).withComponent<SelectedActionComponent>('selected-action', {})
  }

  public selectActionType(world: TlbWorld, ui: UIResource, selectedAction: SelectedActionComponent) {
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
        case 'nail gun': {
          selectedAction.type = 'use'
          selectedAction.using = 1
          break
        }
        default:
          break
      }
      ui.hideSelectList(world)
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
