import { Mod, Item, ModKind } from '../components/items';
import { Random } from '../random';
import { RegionsType } from '../components/region';
export declare const mods: Mod[];
export declare function getRandomMod(random: Random, kind: ModKind, item: Item, region: RegionsType): Mod | undefined;
