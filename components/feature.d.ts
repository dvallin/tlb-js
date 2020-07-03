import { Color } from '../renderer/color';
import { TlbWorld } from '../tlb';
import { WorldMap } from '../resources/world-map';
import { Vector } from '../spatial';
import { Entity } from '../ecs/entity';
import { FeatureType } from '../assets/features';
export declare type FeatureProvider = () => Feature;
export interface FeatureComponent {
    feature: FeatureProvider;
}
export interface Feature {
    character: string;
    diffuse: Color;
    blocking: boolean;
    lightBlocking: boolean;
    name: string;
}
export declare function getFeature(world: TlbWorld, entity: Entity): Feature | undefined;
export declare function createFeatureFromType(world: TlbWorld, map: WorldMap, level: number, position: Vector, type: FeatureType): Entity;
export declare function createFeature(world: TlbWorld, map: WorldMap, level: number, position: Vector, feature: FeatureProvider): Entity;
