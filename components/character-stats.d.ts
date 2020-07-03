import { ItemKind } from './items';
import { CharacterStatsType } from '../assets/characters';
export interface CharacterStatsComponent {
    type: CharacterStatsType;
    current: CharacterStats;
}
export declare function createCharacterStatsComponent(type: CharacterStatsType): CharacterStatsComponent;
export declare type bodyPartType = 'head' | 'arm' | 'torso' | 'leg';
export interface BodyPart {
    type: bodyPartType;
    itemAttachments: ItemKind[];
    health: number;
}
export interface CharacterStats {
    bodyParts: {
        [key: string]: BodyPart;
    };
    strength: number;
    movement: number;
    actions: number;
    aim: number;
}
export declare function speed(stats: CharacterStatsComponent): number;
