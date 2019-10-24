import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { TakeTurnComponent } from '../components/rounds'
import { HasActionComponent, Action } from '../components/action'
import { EquipedItemsComponent, ItemComponent, InventoryComponent } from '../components/items'
import { SelectableAction, ActionGroup } from '../ui/tabs/action-selector'
import { actions } from '../assets/actions'
import { items } from '../assets/items'

export function calculateAvailableActions(
  world: TlbWorld,
  entity: Entity,
  takeTurn: TakeTurnComponent,
  withConsumables: boolean
): ActionGroup[] {
  const playerActionGroup = buildPlayerActionGroup(world, entity, takeTurn)
  const equipmentActionGroups = buildEquipmentActionGroups(world, entity, takeTurn)
  let comsumableGroups: ActionGroup[] = []
  if (withConsumables) {
    comsumableGroups = buildConsumableActionGroups(world, entity, takeTurn)
  }
  return [playerActionGroup].concat(equipmentActionGroups).concat(comsumableGroups)
}

function buildPlayerActionGroup(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent): ActionGroup {
  const hasActions = world.getComponent<HasActionComponent>(entity, 'has-action')!
  const selectableActions = buildSelectableActions(hasActions.actions.map(a => actions[a]), takeTurn)
  return { items: selectableActions, name: 'player', description: 'actions you can do without any equipment', entity }
}

function buildEquipmentActionGroups(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent): ActionGroup[] {
  const equipment = world.getComponent<EquipedItemsComponent>(entity, 'equiped-items')!
  return equipment.equipment.map(equiped => {
    const item = items[world.getComponent<ItemComponent>(equiped.entity, 'item')!.type]
    const selectableActions: SelectableAction[] = buildSelectableActions(item.actions.map(a => actions[a]), takeTurn)
    return { items: selectableActions, description: item.description, name: item.name, entity: equiped.entity }
  })
}

function buildConsumableActionGroups(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent): ActionGroup[] {
  const inventory = world.getComponent<InventoryComponent>(entity, 'inventory')!
  return inventory.content
    .map(inventoryContent => {
      const item = items[world.getComponent<ItemComponent>(inventoryContent, 'item')!.type]
      if (item.kind === 'consumable') {
        const selectableActions: SelectableAction[] = buildSelectableActions(item.actions.map(a => actions[a]), takeTurn)
        return { items: selectableActions, description: item.description, name: item.name, entity: inventoryContent }
      }
      return undefined
    })
    .filter(a => a !== undefined) as ActionGroup[]
}

function buildSelectableActions(availableActions: Action[], takeTurn: TakeTurnComponent): SelectableAction[] {
  return availableActions.map(action => {
    return {
      action,
      available: action.cost.actions <= takeTurn.actions && action.cost.movement <= takeTurn.movements,
    }
  })
}
