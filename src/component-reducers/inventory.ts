import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { InventoryComponent, ItemComponent } from '../components/items'
import { ItemType } from '../assets/items'

export function hasItem(world: TlbWorld, entity: Entity, type: ItemType): boolean {
  const inventory = world.getComponent<InventoryComponent>(entity, 'inventory')!.content
  return inventory.some(i => world.getComponent<ItemComponent>(i, 'item')!.type === type)
}
