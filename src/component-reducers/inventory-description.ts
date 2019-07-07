import { TlbWorld } from '../tlb'
import { InventoryComponent, ItemComponent, items, Item, EquipedItemsComponent, EquipmentAttachement } from '../components/items'
import { Entity } from '../ecs/entity'
import { CharacterStatsComponent } from '../components/character-stats'

export function maximumInventoryWeight(stats: CharacterStatsComponent): number {
  return stats.current.strength * 5
}

export interface InventoryDescription {
  inventory: InventoryComponent
  items: Item[]
  equipment: EquipmentAttachement[]
  currentWeight: number
  maximumWeight: number | undefined
}

export function createInventoryDescription(world: TlbWorld, entity: Entity): InventoryDescription {
  const inventory = world.getComponent<InventoryComponent>(entity, 'inventory')!
  const stats = world.getComponent<CharacterStatsComponent>(entity, 'character-stats')
  const equiped = world.getComponent<EquipedItemsComponent>(entity, 'equiped-items') || { equipment: [] }
  let maximumWeight: number | undefined = undefined
  if (stats !== undefined) {
    maximumWeight = maximumInventoryWeight(stats)
  }
  const inventoryItems = inventory.content.map(e => {
    const item = world.getComponent<ItemComponent>(e, 'item')!
    return items[item.type]
  })
  const currentWeight = inventory.content
    .map(i => {
      const item = world.getComponent<ItemComponent>(i, 'item')!
      return items[item.type].weight
    })
    .reduce((a, b) => a + b, 0)
  return { inventory, items: inventoryItems, maximumWeight, currentWeight, equipment: equiped.equipment }
}
