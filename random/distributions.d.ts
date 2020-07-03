import { RandomSeed } from 'random-seed';
export interface Distribution {
    sample(): number;
}
export declare class Uniform implements Distribution {
    readonly rng: RandomSeed;
    constructor(seed: string);
    sample(): number;
}
export declare class Exponential implements Distribution {
    readonly distribution: Distribution;
    readonly lambda: number;
    static fromSeed(seed: string, lambda?: number): Exponential;
    private scale;
    constructor(distribution: Distribution, lambda?: number);
    sample(): number;
}
