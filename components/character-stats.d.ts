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
}
export interface CharacterStats {
    bodyParts: {
        [key: string]: BodyPart;
    };
    health: number;
    strength: number;
    aim: number;
}
export declare function speed(_stats: CharacterStatsComponent): number;
