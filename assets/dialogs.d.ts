import { TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
export declare type AnswerType = 'close' | 'attack' | 'authorized';
export declare type Check = (world: TlbWorld, player: Entity, npc: Entity) => boolean;
export interface Answer {
    text: string;
    navigation: number | AnswerType;
    check?: Check;
}
export interface Step {
    text: string[];
    answers: Answer[];
}
export interface Dialog {
    steps: Step[];
}
declare const dialogDefinitions: {
    randomRemarks: {
        steps: {
            text: string[];
            answers: Answer[];
        }[];
    };
    guardRandomRemarks: {
        steps: {
            text: string[];
            answers: Answer[];
        }[];
    };
    restrictedAreaCheck: {
        steps: {
            text: string[];
            answers: Answer[];
        }[];
    };
};
export declare type DialogType = keyof typeof dialogDefinitions;
export declare const dialogs: {
    [key in DialogType]: Dialog;
};
export declare function addDialog(world: TlbWorld, entity: Entity, type: DialogType): void;
export {};
