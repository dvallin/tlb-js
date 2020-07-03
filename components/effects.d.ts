import { Entity } from '../ecs/entity';
import { bodyPartType } from './character-stats';
export declare type effect = 'damage' | 'kill' | 'stun' | 'bleed' | 'confuse' | 'defend' | 'immobilize';
export interface Effect {
    type: effect;
    global: boolean;
    negated: boolean;
    restricted?: bodyPartType[];
    duration?: number;
    value?: number;
}
export interface ActiveEffectsComponent {
    effects: {
        effect: Effect;
        bodyPart?: string;
    }[];
}
export interface EffectComponent {
    effect: Effect;
    source: Entity;
    target: Entity;
    bodyParts?: string[];
}
export declare function damage(value: number, restricted?: bodyPartType[]): Effect;
export declare function confuse(duration: number): Effect;
export declare function defend(value: number, duration: number): Effect;
export declare function stun(duration: number): Effect;
export declare function immobilize(duration: number): Effect;
export declare function kill(): Effect;
