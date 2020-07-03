import { TlbWorld } from '../tlb';
import { InventoryComponent, Item, EquipmentAttachement, Mod } from '../components/items';
import { Entity } from '../ecs/entity';
import { CharacterStatsComponent } from '../components/character-stats';
export declare function maximumInventoryWeight(stats: CharacterStatsComponent): number;
export interface ItemWithEntity {
    item: Item;
    mods: Mod[];
    entity: Entity;
}
export interface InventoryDescription {
    inventory: InventoryComponent;
    items: ItemWithEntity[];
    equipment: EquipmentAttachement[];
    currentWeight: number;
    maximumWeight: number | undefined;
}
export declare function createInventoryDescription(world: TlbWorld, entity: Entity): InventoryDescription;
