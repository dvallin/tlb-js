import { Entity } from '../ecs/entity';
export declare type effect = 'damage' | 'cooldown' | 'cooldown-buff' | 'kill' | 'stun' | 'bleed' | 'confuse' | 'defense' | 'immobilize' | 'negate' | 'heal' | 'aim' | 'crit-chance' | 'crit-multiplier';
export interface Effect {
    type: effect;
    negative: boolean;
    duration?: number;
    value?: number;
}
export interface ActiveEffectsComponent {
    effects: EffectApplication[];
}
export interface EffectApplication {
    source: Entity;
    effect: Effect;
    isCritical: boolean;
    isPiercing: boolean;
}
export declare function damage(value: number): Effect;
export declare function cooldown(duration: number): Effect;
export declare function cooldownBuff(value: number, duration: number | undefined): Effect;
export declare function confuse(duration: number): Effect;
export declare function defend(value: number, duration: number | undefined): Effect;
export declare function penetrate(value: number, duration: number | undefined): Effect;
export declare function stun(duration: number): Effect;
export declare function immobilize(duration: number): Effect;
export declare function aim(value: number, duration: number | undefined): Effect;
export declare function critChance(value: number, duration: number | undefined): Effect;
export declare function critMultiplier(value: number, duration: number | undefined): Effect;
export declare function bleed(): Effect;
export declare function kill(): Effect;
export declare function negateEffects(): Effect;
export declare function heal(): Effect;
