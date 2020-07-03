import { TlbWorld, ComponentName } from '../tlb';
import { Entity } from '../ecs/entity';
export declare const turnComponents: ComponentName[];
export declare function turnBasedEntities(world: TlbWorld): number;
export declare function isTurnBased(world: TlbWorld, entity: Entity): boolean;
export declare function clearTurnBased(world: TlbWorld): void;
export declare function playerIsStruggling(world: TlbWorld): boolean;
export declare function playerIsDead(world: TlbWorld): boolean;
