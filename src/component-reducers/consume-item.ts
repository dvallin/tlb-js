import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { InventoryComponent, EquipedItemsComponent } from '../components/items'

export function consumeItem(world: TlbWorld, consumer: Entity, item: Entity): void {
  const inventory = world.getComponent<InventoryComponent>(consumer, 'inventory')!
  inventory.content = inventory.content.filter(i => i !== item)
  const equipedItems = world.getComponent<EquipedItemsComponent>(consumer, 'equiped-items')!
  equipedItems.equipment = equipedItems.equipment.filter(e => e.entity !== item)
}
