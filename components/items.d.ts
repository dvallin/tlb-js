import { Entity } from '../ecs/entity';
import { Effect } from './effects';
import { ItemBaseType } from '../assets/items';
import { Action } from './action';
import { RegionsType } from './region';
import { Random } from '../random';
import { TlbWorld } from '../tlb';
export declare type WearableKind = 'glove' | 'helmet' | 'armor' | 'pants' | 'boots';
export declare type ItemKind = 'scrap' | 'consumable' | 'weapon' | WearableKind;
export declare type ItemTag = 'rifle' | 'high-tech' | 'melee' | 'gun';
export declare type ModAction = 'overcharge' | 'doubleShot' | 'frenzy' | 'headshot' | 'execute' | 'ranged' | 'stabilizing' | 'bloody' | 'acrobatics' | 'stunning' | 'penetrating' | 'mobile' | 'enhanced' | 'fast';
export declare type ModKind = 'passive' | 'active';
export interface Mod {
    kind: ModKind;
    adjective: string;
    occurs: RegionsType[];
    action?: ModAction;
    effects?: Effect[];
    matches: {
        kind: ItemKind;
        tags: ItemTag[];
    }[];
}
export interface Item {
    base: ItemBaseType;
    tags: ItemTag[];
    name: string;
    shortName: string;
    description: string;
    actions: Action[];
    effects: Effect[];
    kind: ItemKind;
    weight: number;
    attachments: number;
}
export interface InventoryComponent {
    content: Entity[];
}
export interface ItemComponent {
    item: Item;
    mods: Mod[];
}
export interface EquipmentAttachement {
    entity: Entity;
    bodyParts: string[];
}
export interface EquipedItemsComponent {
    equipment: EquipmentAttachement[];
}
export declare function createEntityWithItemComponent(world: TlbWorld, base: ItemBaseType, random: Random, region: RegionsType): Entity;
