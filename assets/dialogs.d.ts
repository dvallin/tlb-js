import { TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
export declare type AnswerType = 'close' | 'attack' | 'authorized' | 'move_level_up' | 'move_level_down' | 'trigger' | 'unlock_lore' | 'start_quest';
export declare type Result = Answer | Navigation | NextDialog;
export interface NextDialog {
    text: string;
    type: 'next_dialog';
    dialog: DialogType;
}
export interface Answer {
    text: string;
    type: AnswerType;
    target?: Entity;
}
export interface Navigation {
    text: string;
    type: number;
}
export interface Step {
    text: string[];
    answers: Result[];
}
export interface Dialog {
    steps(world: TlbWorld, player: Entity, owner: Entity): Step[];
}
declare const dialogDefinitions: {
    startLore1: Dialog;
    startQuest1: Dialog;
    terminal: Dialog;
    core: Dialog;
    civilianDialog: Dialog;
    guardRandomRemarks: Dialog;
    restrictedAreaCheck: Dialog;
    elevator: Dialog;
};
export declare type DialogType = keyof typeof dialogDefinitions;
export declare const dialogs: {
    [key in DialogType]: Dialog;
};
export declare function addDialog(world: TlbWorld, entity: Entity, type: DialogType): Entity;
export {};
