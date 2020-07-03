import { TlbWorld } from '../tlb';
import { Attack } from '../components/action';
import { Entity } from '../ecs/entity';
export interface HitChanceCalculation {
    base: number;
    distancePenalty: number;
    coverPenalty: number;
    final: number;
    criticalHit: number;
}
export declare function calculateHitChance(world: TlbWorld, entity: Entity, target: Entity, attack: Attack): HitChanceCalculation;
