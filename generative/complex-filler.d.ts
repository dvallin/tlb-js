import { StructureDescription } from './complex-embedder';
import { TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
import { Random } from '../random';
import { WorldMap } from '../resources/world-map';
export declare function fill(world: TlbWorld, map: WorldMap, level: number, entity: Entity, random: Random, description: StructureDescription): void;
