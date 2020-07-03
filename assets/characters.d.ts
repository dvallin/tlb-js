import { BodyPart, CharacterStats } from '../components/character-stats';
import { TlbWorld } from '../tlb';
import { FeatureType } from './features';
import { CharacterCreator } from '../generative/complex-embedder';
import { Entity } from '../ecs/entity';
import { ActionType } from './actions';
import { ItemType } from './items';
declare const charactersStatsDefinition: {
    player: {
        bodyParts: {
            [key: string]: BodyPart;
        };
        strength: number;
        movement: number;
        actions: number;
        aim: number;
    };
    guard: {
        bodyParts: {
            [key: string]: BodyPart;
        };
        strength: number;
        movement: number;
        actions: number;
        aim: number;
    };
    eliteGuard: {
        bodyParts: {
            [key: string]: BodyPart;
        };
        strength: number;
        movement: number;
        actions: number;
        aim: number;
    };
    boss: {
        bodyParts: {
            [key: string]: BodyPart;
        };
        strength: number;
        movement: number;
        actions: number;
        aim: number;
    };
};
export declare type CharacterStatsType = keyof typeof charactersStatsDefinition;
export declare const characterStats: {
    [key in CharacterStatsType]: CharacterStats;
};
declare const characterCreatorsDefinition: {
    player: (world: import("../ecs/world").World<import("../tlb").ComponentName, import("../tlb").SystemName, import("../tlb").ResourceName>) => number;
    eliteGuard: (world: import("../ecs/world").World<import("../tlb").ComponentName, import("../tlb").SystemName, import("../tlb").ResourceName>) => number;
    guard: (world: import("../ecs/world").World<import("../tlb").ComponentName, import("../tlb").SystemName, import("../tlb").ResourceName>) => number;
};
export declare const defaultActions: ActionType[];
export declare function createPlayer(world: TlbWorld): Entity;
export declare function createDefaultNpc(world: TlbWorld, name: string, statsType: CharacterStatsType, featureType: FeatureType): Entity;
export declare function take(world: TlbWorld, entity: Entity, type: ItemType): Entity;
export declare function equip(world: TlbWorld, entity: Entity, type: ItemType, bodyParts: string[]): void;
export declare function createEmptyNpc(world: TlbWorld, name: string, statsType: CharacterStatsType, featureType: FeatureType, actions: ActionType[]): Entity;
export declare function createCharacter(world: TlbWorld, name: string, statsType: CharacterStatsType, featureType: FeatureType, actions: ActionType[]): Entity;
export declare type CharacterCreatorType = keyof typeof characterCreatorsDefinition;
export declare const characterCreators: {
    [key in CharacterCreatorType]: CharacterCreator;
};
export {};
