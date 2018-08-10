import * as seedrandom from "seedrandom"

let rng: seedrandom.prng

export function init(seed?: string): void {
    rng = seedrandom(seed)
}

export function uniformInteger(min: number = 0, max: number = 1): number {
    return (Math.abs(rng.int32()) % (max - min)) + min
}

export function bernoulli(p: number = 0.5): boolean {
    return rng.double() <= p
}

export function binomialNormed(p: number[]): number {
    let test = rng.double()
    return p.findIndex((t) => {
        if (test <= t) {
            return true
        }
        test -= t
        return false
    })
}

export function dualDecision(
    p00: number, [p01, p10]: number[], p11: number
): [boolean, boolean] {
    const decision = binomialNormed([p00, p01, p10, p11])
    return [
        Math.floor(decision / 2) % 2 === 1,
        decision % 2 === 1
    ]
}

export function ternaryDecision(
    p000: number, [p001, p010, p100]: number[], [p011, p101, p110]: number[], p111: number
): [boolean, boolean, boolean] {
    const decision = binomialNormed([p000, p001, p010, p011, p100, p101, p110, p111])
    return [
        Math.floor(decision / 4) % 2 === 1,
        Math.floor(decision / 2) % 2 === 1,
        decision % 2 === 1
    ]
}
