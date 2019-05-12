import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { TakeTurnComponent } from '../components/rounds'
import { HasActionComponent, ActionType, actions } from '../components/action'
import { EquipmentComponent, ItemComponent, items } from '../components/items'
import { SelectableAction, ActionGroup } from '../ui/action-selector'

export function calculateAvailableActions(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent): ActionGroup[] {
  const playerActionGroup = buildPlayerActionGroup(world, entity, takeTurn)
  const equipmentActionGroups = buildEquipmentActionGroups(world, entity, takeTurn)
  return equipmentActionGroups.concat(playerActionGroup)
}

function buildPlayerActionGroup(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent): ActionGroup {
  const hasActions = world.getComponent<HasActionComponent>(entity, 'has-action')!
  const playerActions = buildSelectableActions(hasActions.actions, takeTurn)
  return { actions: playerActions, name: 'player', description: 'your inert actions', entity }
}

function buildEquipmentActionGroups(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent): ActionGroup[] {
  const equipment = world.getComponent<EquipmentComponent>(entity, 'equipment')!
  return equipment.equiped.map(entity => {
    const item = items[world.getComponent<ItemComponent>(entity, 'item')!.type]
    const actions: SelectableAction[] = buildSelectableActions(item.actions, takeTurn)
    return { actions, description: item.description, name: item.name, entity }
  })
}

function buildSelectableActions(availableActions: ActionType[], takeTurn: TakeTurnComponent): SelectableAction[] {
  return availableActions.map(action => {
    const a = actions[action]
    return {
      action: a,
      available: a.cost.actions <= takeTurn.actions && a.cost.movement <= takeTurn.movements,
    }
  })
}
