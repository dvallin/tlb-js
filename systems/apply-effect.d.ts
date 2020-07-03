import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { EffectComponent } from '../components/effects';
import { Entity } from '../ecs/entity';
export declare class ApplyEffects implements TlbSystem {
    readonly components: ComponentName[];
    update(world: TlbWorld, entity: Entity): void;
    applyDamage(world: TlbWorld, effectComponent: EffectComponent): void;
    applyHeal(world: TlbWorld, effectComponent: EffectComponent): void;
    applyStatusEffect(world: TlbWorld, effectComponent: EffectComponent): void;
}
