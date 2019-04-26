import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { TakeTurnComponent } from '../components/rounds'
import { Action, HasActionComponent, ActionType, actions } from '../components/action'
import { EquipmentComponent, ItemComponent, items } from '../components/items'

export function calculateAvailableActions(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent): Action[] {
  const hasActions = world.getComponent<HasActionComponent>(entity, 'has-action')!
  const equipment = world.getComponent<EquipmentComponent>(entity, 'equipment')!
  const equipmentActions: ActionType[][] = equipment.equiped
    .map(e => world.getComponent<ItemComponent>(e, 'item')!)
    .map(i => items[i.type])
    .map(item => item.actions)
  const allActions: ActionType[] = hasActions.actions.concat(...equipmentActions)

  return allActions.map(a => actions[a]).filter(a => a.cost.actions <= takeTurn.actions && a.cost.movement <= takeTurn.movements)
}
