import { TlbWorld } from '../tlb';
import { Vector } from '../spatial';
import { Path } from './astar';
import { Entity } from '../ecs/entity';
export interface QueryParameters {
    onlyDiscovered: boolean;
    maximumCost: number;
    bestEffort: boolean;
    self: Entity;
    endInDoor: boolean;
    jump: boolean;
}
export declare class Queries {
    fov(world: TlbWorld, level: number, origin: Vector, callback: (pos: Vector) => void): void;
    explore(world: TlbWorld, level: number, origin: Vector, visit: (pos: Vector, distance: number) => boolean, params: Partial<QueryParameters>): void;
    shortestPath(world: TlbWorld, level: number, origin: Vector, target: Vector, params: Partial<QueryParameters>): Path | undefined;
    los(world: TlbWorld, level: number, origin: Vector, target: Vector, params: Partial<QueryParameters>): Path | undefined;
}
