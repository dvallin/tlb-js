import { DialogType } from './dialogs';
export interface Lore {
    name: string;
    start: DialogType;
    startText: string;
}
declare const loreDefinitions: {
    lore1: Lore;
};
export declare type LoreType = keyof typeof loreDefinitions;
export declare const lores: {
    [key in LoreType]: Lore;
};
export {};
