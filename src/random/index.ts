import { create, RandomSeed } from "random-seed"

export interface Random {
    decision(probability: number): boolean
}

export class SeedableRandom implements Random {

    private readonly rng: RandomSeed

    public constructor(seed: string) {
        this.rng = create(seed)
    }

    public decision(probability: number): boolean {
        return this.rng.random() < probability
    }
}
