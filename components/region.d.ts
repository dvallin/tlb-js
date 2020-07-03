import { Shape } from '../geometry/shape';
import { Vector } from '../spatial';
import { Entity } from '../ecs/entity';
export declare type RegionsType = 'entrance' | 'ground-floor' | 'elevator' | 'red-base' | 'red-plus' | 'green-base' | 'green-plus' | 'yellow-base' | 'yellow-plus' | 'blue-base' | 'blue-plus' | 'core';
export interface RegionComponent {
    type: RegionsType;
    level: number;
    shape: Shape;
    exits: Vector[];
    authorized: Set<Entity>;
}
export declare type StructureType = 'room' | 'hub' | 'corridor';
export interface StructureComponent {
    region: Entity;
    kind: StructureType;
    shape: Shape;
    connections: Entity[];
}
