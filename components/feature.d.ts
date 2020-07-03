import { Color } from '../renderer/color';
import { TlbWorld } from '../tlb';
import { Vector } from '../spatial';
import { Entity } from '../ecs/entity';
import { FeatureType } from '../assets/features';
export declare type FeatureProvider = () => Feature;
export interface FeatureComponent {
    feature: FeatureProvider;
}
export declare type Cover = 'full' | 'partial' | 'none';
export interface Feature {
    character: string;
    diffuse: Color;
    cover: Cover;
    blocking: boolean;
    lightBlocking: boolean;
    ground: boolean;
    name: string;
}
export declare function getFeature(world: TlbWorld, entity: Entity): Feature | undefined;
export declare function createFeatureFromType(world: TlbWorld, level: number, position: Vector, type: FeatureType): Entity;
export declare function createFeature(world: TlbWorld, level: number, position: Vector, feature: FeatureProvider): Entity;
