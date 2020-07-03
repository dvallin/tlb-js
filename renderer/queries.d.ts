import { TlbWorld } from '../tlb';
import { Vector } from '../spatial';
import { Color } from './color';
import { Path } from './astar';
import { Entity } from '../ecs/entity';
export interface QueryParameters {
    onlyDiscovered: boolean;
    maximumCost: number;
    bestEffort: boolean;
    self: Entity;
}
export declare class Queries {
    fov(world: TlbWorld, level: number, origin: Vector, callback: (pos: Vector, distance: number) => void): void;
    lighting(world: TlbWorld, level: number, origin: Vector, color: Color, callback: (pos: Vector, color: Color) => void): void;
    explore(world: TlbWorld, level: number, origin: Vector, visit: (pos: Vector, distance: number) => boolean, params: Partial<QueryParameters>): void;
    shortestPath(world: TlbWorld, level: number, origin: Vector, target: Vector, params: Partial<QueryParameters>): Path | undefined;
    ray(world: TlbWorld, level: number, origin: Vector, target: Vector, params: Partial<QueryParameters>): Path | undefined;
}
