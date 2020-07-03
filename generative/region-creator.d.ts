import { TlbWorld } from '../tlb';
import { RegionsType } from '../components/region';
import { Shape } from '../geometry/shape';
import { Entity } from '../ecs/entity';
import { Vector } from '../spatial';
export declare function createRegion(world: TlbWorld, level: number, type: RegionsType, shape: Shape, exits: Vector[]): Entity;
export declare function buildCore(world: TlbWorld): void;
export declare function buildCyberSpace(world: TlbWorld): void;
export declare function buildLevel(world: TlbWorld, level: number, left: RegionsType, right: RegionsType): Entity;
export declare function buildGroundFloor(world: TlbWorld): Entity;
export declare function create(world: TlbWorld): Entity;
