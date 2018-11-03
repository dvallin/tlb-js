import { create, RandomSeed } from "random-seed"

export interface Random {
    decision(probability: number): boolean
    weightedDecision(weights: number[]): number
    integerBetween(min: number, max: number): number
    shuffle<T>(array: T[]): void
}

export class SeedableRandom implements Random {

    public readonly rng: RandomSeed

    public constructor(seed: string) {
        this.rng = create(seed)
    }

    public decision(probability: number): boolean {
        return this.rng.random() < probability
    }

    public weightedDecision(weights: number[]): number {
        const sum = weights.reduce((v, c) => v + c, 0)
        const pick = this.rng.intBetween(0, sum - 1)
        let agg = 0
        for (let i = 0; i < weights.length; i++) {
            agg += weights[i]
            if (pick < agg) {
                return i
            }
        }
        throw new Error("invalid input to weighted decision")
    }

    public integerBetween(minInclusive: number, maxInclusive: number): number {
        return this.rng.intBetween(minInclusive, maxInclusive)
    }

    public shuffle<T>(array: T[]): void {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = this.integerBetween(0, i)
            const t = array[i]
            array[i] = array[j]
            array[j] = t
        }
    }
}
