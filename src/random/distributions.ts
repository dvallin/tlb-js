import { create, RandomSeed } from "random-seed"

export interface Distribution {
    sample(): number
}

export class Uniform implements Distribution {
    public readonly rng: RandomSeed

    public constructor(seed: string) {
        this.rng = create(seed)
    }

    public sample(): number {
        return this.rng.random()
    }
}

export class Exponential implements Distribution {

    public static fromSeed(seed: string, lambda: number = 1) {
        return new Exponential(new Uniform(seed), lambda)
    }

    private scale: number

    public constructor(
        public readonly distribution: Distribution,
        public readonly lambda: number = 1
    ) {
        this.scale = 1 - Math.exp(-this.lambda)
    }

    public sample(): number {
        const u = this.distribution.sample()
        return -Math.log(1 - this.scale * u) / this.lambda
    }
}
