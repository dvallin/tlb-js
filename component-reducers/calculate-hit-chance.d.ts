import { TlbWorld } from '../tlb';
import { Attack } from '../components/action';
import { Entity } from '../ecs/entity';
export declare function calculateHitChance(world: TlbWorld, entity: Entity, target: Entity, attack: Attack): number;
