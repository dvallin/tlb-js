import { StructureType } from '../components/region';
import { TlbWorld } from '../tlb';
import { Random } from '../random';
import { Entity } from '../ecs/entity';
import { AssetType } from '../assets/assets';
import { ItemType } from '../assets/items';
export interface ComplexTemplate {
    structures: {
        description: StructureDescription;
        restriction: Partial<StructureRestriction>;
    }[];
}
export interface ComplexDescription {
    occurrence: Occurrence;
    template: ComplexTemplate;
}
export interface Occurrence {
    minimum: number;
    maximum: number;
}
export interface Spawn<T> {
    types: T[];
    occurrence: Occurrence;
}
export interface StructureRestriction {
    kind: StructureType;
    connects: number[];
    exact: boolean;
    blocking: boolean;
}
export interface CharacterCreator {
    (world: TlbWorld): Entity;
}
export interface StructureDescription {
    decorations: Spawn<AssetType>[];
    containers: Spawn<AssetType>[];
    loots: Spawn<ItemType>[];
    npcs: Spawn<CharacterCreator>[];
    bosses: Spawn<CharacterCreator>[];
}
export declare function occur(min?: number, max?: number): Occurrence;
export declare function optional(t?: number): Occurrence;
export declare function spawn<T>(...types: T[]): Spawn<T>;
export declare function spawnTimes<T>(type: T, t: number): Spawn<T>;
export declare function spawnOptional<T>(type: T, t?: number): Spawn<T>;
interface ComplexEmbedding {
    structure: StructureDescription;
    embedding: Entity;
    blocking: boolean;
}
export declare function embedComplexes(world: TlbWorld, random: Random, region: Entity, complexes: ComplexDescription[]): ComplexEmbedding[];
export declare function traverseEdge(e: [number, number], from: number): number | undefined;
export {};
