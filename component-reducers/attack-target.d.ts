import { TlbWorld } from '../tlb';
import { Attack } from '../components/action';
import { Entity } from '../ecs/entity';
import { Effect } from '../components/effects';
import { Random } from '../random';
export declare function attackTarget(world: TlbWorld, random: Random, entity: Entity, target: Entity, attack: Attack): void;
export declare function getAfflictedBodyparts(world: TlbWorld, random: Random, target: Entity, effect: Effect): string[] | undefined;
