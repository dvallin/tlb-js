import { TlbWorld } from '../tlb';
import { Attack } from '../components/action';
import { Entity } from '../ecs/entity';
import { Random } from '../random';
import { HitChanceCalculation } from './calculate-hit-chance';
import { EffectResult } from './apply-effect';
export interface AttackResult {
    isHit: boolean;
    isCritical: boolean;
    chance: HitChanceCalculation;
    effects: Partial<EffectResult>[];
}
export declare function attackTarget(world: TlbWorld, random: Random, entity: Entity, target: Entity, attack: Attack): AttackResult;
