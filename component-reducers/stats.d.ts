import { effect } from '../components/effects';
import { Entity } from '../ecs/entity';
import { TlbWorld } from '../tlb';
export declare function getAim(world: TlbWorld, entity: Entity): number;
export declare function getCriticalChance(world: TlbWorld, entity: Entity): number;
export declare function getCooldownBuff(world: TlbWorld, entity: Entity): number;
export declare function getCriticalMultiplier(world: TlbWorld, entity: Entity): number;
export declare function getDefense(world: TlbWorld, entity: Entity): number;
export declare function getCanMove(world: TlbWorld, entity: Entity): boolean;
export declare function getCanAct(world: TlbWorld, entity: Entity): boolean;
export declare function hasEffect(world: TlbWorld, entity: Entity, ...types: effect[]): boolean;
export declare function reduceActiveEffects(world: TlbWorld, entity: Entity, type: effect): number;
