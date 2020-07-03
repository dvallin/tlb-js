import { Item } from '../components/items';
import { Random } from '../random';
import { RegionsType } from '../components/region';
export declare type ItemBaseType = 'deathPill' | 'bandages' | 'nailGun' | 'gun' | 'powerGauntlet' | 'rifle' | 'sniperRifle' | 'leatherJacket' | 'idCard' | 'boots';
export declare function createItem(base: ItemBaseType, _random: Random, _region: RegionsType): Item;
