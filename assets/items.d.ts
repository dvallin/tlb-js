import { Item } from '../components/items';
declare const itemsDefinition: {
    nailGun: Item;
    rifle: Item;
    sniperRifle: Item;
    deathPill: Item;
    bandages: Item;
    leatherJacket: Item;
    bootsOfStriding: Item;
    idCard: Item;
};
export declare type ItemType = keyof typeof itemsDefinition;
export declare const items: {
    [key in ItemType]: Item;
};
export {};
