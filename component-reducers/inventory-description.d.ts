import { TlbWorld } from '../tlb';
import { InventoryComponent, Item, EquipmentAttachement } from '../components/items';
import { Entity } from '../ecs/entity';
import { CharacterStatsComponent } from '../components/character-stats';
export declare function maximumInventoryWeight(stats: CharacterStatsComponent): number;
export interface InventoryDescription {
    inventory: InventoryComponent;
    items: Item[];
    equipment: EquipmentAttachement[];
    currentWeight: number;
    maximumWeight: number | undefined;
}
export declare function createInventoryDescription(world: TlbWorld, entity: Entity): InventoryDescription;
