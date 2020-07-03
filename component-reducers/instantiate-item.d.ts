import { Item, Mod } from '../components/items';
import { TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
export declare function instantiateItem(world: TlbWorld, entity: Entity): {
    item: Item;
    mods: Mod[];
};
