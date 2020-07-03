import { TlbWorld } from '../tlb';
import { EffectApplication, effect } from '../components/effects';
import { Entity } from '../ecs/entity';
import { Random } from '../random';
export interface EffectResult {
    type: effect;
    killed?: boolean;
    baseDamage?: number;
    defense?: number;
    finalDamage?: number;
}
export declare function applyEffect(world: TlbWorld, uniform: Random, target: Entity, application: EffectApplication): EffectResult;
export declare function clearExpiredEffects(world: TlbWorld, entity: Entity): void;
export declare function updateEffects(world: TlbWorld, entity: Entity, uniform: Random): void;
export declare function applyDamage(world: TlbWorld, uniform: Random, target: Entity, application: EffectApplication): Partial<EffectResult>;
export declare function applyHeal(world: TlbWorld, target: Entity, application: EffectApplication): Partial<EffectResult>;
export declare function applyStatusEffect(world: TlbWorld, target: Entity, application: EffectApplication): Partial<EffectResult>;
export declare function removeAllNegativeEffects(world: TlbWorld, target: Entity): Partial<EffectResult>;
