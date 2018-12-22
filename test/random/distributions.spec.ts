import { Uniform, Exponential, Distribution } from "../../src/random/distributions"

const uniform = new Uniform("seed")

describe(Uniform.name, () => {

    samplesIntoUnitInterval(uniform)
})

describe(Exponential.name, () => {

    samplesIntoUnitInterval(Exponential.fromSeed("seed"))

    describe("lambda=0.1", () => {
        samplesIntoUnitInterval(Exponential.fromSeed("seed", 0.1))
        samplesNicely(new Exponential(uniform, 0.1), uniform)
    })
    describe("lambda=0.5", () => samplesNicely(new Exponential(uniform, 0.5), uniform))
    describe("lambda=1", () => samplesNicely(new Exponential(uniform, 1), uniform))
    describe("lambda=2", () => {
        samplesIntoUnitInterval(Exponential.fromSeed("seed", 2))
        samplesNicely(new Exponential(uniform, 2), uniform)
    })
})

function samplesIntoUnitInterval(distribution: Distribution) {
    it("samples into unit interval", () => {
        for (let i = 0; i < 1000; i++) {
            const r = distribution.sample()
            expect(r).toBeGreaterThan(0.0)
            expect(r).toBeLessThan(1.0)
        }
    })
}

function samplesNicely(distribution: Distribution, underlyingDistribution: Distribution): void {

    it("samples nicely", () => {
        let samples: number[] = []
        for (let i = 0; i <= 10; i++) {
            underlyingDistribution.sample = jest.fn().mockReturnValue(i / 10)
            samples.push(distribution.sample())
        }
        expect(samples).toMatchSnapshot()
    })
}
