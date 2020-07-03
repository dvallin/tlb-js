import { StructureType } from '../components/region';
import { TlbWorld } from '../tlb';
import { Random } from '../random';
import { Entity } from '../ecs/entity';
import { AssetType } from '../assets/assets';
import { ItemBaseType } from '../assets/items';
import { CharacterCreator } from '../assets/characters';
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
export declare type LayoutKind = 'default' | 'regular';
export declare type Placement = 'wall' | 'center' | 'random';
export interface Layout<T> {
    kind: LayoutKind;
    types: T[];
    occurrence: Occurrence;
    placement: Placement;
}
export interface StructureRestriction {
    kind: StructureType;
    connects: number[];
    exact: boolean;
    blocking: boolean;
}
export interface StructureDescription {
    decorations: Layout<AssetType>[];
    containers: Layout<AssetType>[];
    loots: Layout<ItemBaseType>[];
    npcs: Layout<CharacterCreator>[];
    bosses: Layout<CharacterCreator>[];
}
export declare function occur(min?: number, max?: number): Occurrence;
export declare function optional(t?: number): Occurrence;
export declare function layout<T>(kind: LayoutKind, placement: Placement, occurrence: Occurrence, ...types: T[]): Layout<T>;
export interface ComplexEmbedding {
    structure: StructureDescription;
    embedding: Entity;
    blocking: boolean;
}
export declare function embedComplexes(world: TlbWorld, random: Random, region: Entity, complexes: ComplexDescription[]): ComplexEmbedding[] | undefined;
export declare function traverseEdge(e: [number, number], from: number): number | undefined;
