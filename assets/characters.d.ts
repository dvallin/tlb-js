import { BodyPart, CharacterStats } from '../components/character-stats';
import { TlbWorld } from '../tlb';
import { FeatureType } from './features';
import { Item } from '../components/items';
import { Entity } from '../ecs/entity';
import { Random } from '../random';
import { RegionsType } from '../components/region';
declare const charactersStatsDefinition: {
    player: {
        bodyParts: {
            [key: string]: BodyPart;
        };
        health: number;
        strength: number;
        aim: number;
    };
    guard: {
        bodyParts: {
            [key: string]: BodyPart;
        };
        health: number;
        strength: number;
        aim: number;
    };
    civilian: {
        bodyParts: {
            [key: string]: BodyPart;
        };
        health: number;
        strength: number;
        aim: number;
    };
    eliteGuard: {
        bodyParts: {
            [key: string]: BodyPart;
        };
        health: number;
        strength: number;
        aim: number;
    };
    boss: {
        bodyParts: {
            [key: string]: BodyPart;
        };
        health: number;
        strength: number;
        aim: number;
    };
};
export declare type CharacterStatsType = keyof typeof charactersStatsDefinition;
export declare const characterStats: {
    [key in CharacterStatsType]: CharacterStats;
};
export interface CharacterCreatorOptions {
    type: PlayerType;
}
export interface CharacterCreator {
    (world: TlbWorld, random: Random, region: RegionsType, options: Partial<CharacterCreatorOptions>): Entity;
}
declare const characterCreatorsDefinition: {
    [key in CharacterStatsType]: CharacterCreator;
};
export declare function createBoss(world: TlbWorld, random: Random, region: RegionsType): Entity;
export declare function createPlayer(world: TlbWorld, random: Random, type: PlayerType, region: RegionsType): Entity;
export declare function setType(world: TlbWorld, entity: Entity, type: CharacterType): void;
export declare function createCivilian(world: TlbWorld, _random: Random, name: string, statsType: CharacterStatsType, featureType: FeatureType): Entity;
export declare function createGuard(world: TlbWorld, random: Random, name: string, statsType: CharacterStatsType, featureType: FeatureType, region: RegionsType): Entity;
export declare function take(world: TlbWorld, character: Entity, entity: Entity): void;
export declare function replacingEquip(world: TlbWorld, character: Entity, entity: Entity, item: Item): void;
export declare function equip(world: TlbWorld, character: Entity, entity: Entity, bodyParts: string[]): void;
export declare function unequip(world: TlbWorld, character: Entity, entity: Entity): void;
export declare function createEmptyNpc(world: TlbWorld, name: string, statsType: CharacterStatsType, featureType: FeatureType): Entity;
export declare function createCharacter(world: TlbWorld, statsType: CharacterStatsType, featureType: FeatureType): Entity;
export declare type CharacterCreatorType = keyof typeof characterCreatorsDefinition;
export declare const characterCreators: {
    [key in CharacterCreatorType]: CharacterCreator;
};
export declare type PlayerType = 'red_player' | 'green_player' | 'blue_player' | 'yellow_player';
export declare type CharacterType = PlayerType | 'civilian' | 'henchman' | 'boss';
export {};
