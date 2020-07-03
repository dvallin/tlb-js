import { DialogType } from './dialogs';
export interface Quest {
    name: string;
    startText: string;
    start: DialogType;
}
declare const questDefintions: {
    quest1: Quest;
};
export declare type QuestType = keyof typeof questDefintions;
export declare const quests: {
    [key in QuestType]: Quest;
};
export {};
