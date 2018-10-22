import { SeedableRandom } from "../src/random"

describe("SeedableRandom", () => {

    let random: SeedableRandom
    beforeEach(() => {
        random = new SeedableRandom("000")
        random.rng.random = jest.fn()
            .mockReturnValueOnce(0.0)
            .mockReturnValueOnce(0.1)
            .mockReturnValueOnce(0.25)
            .mockReturnValueOnce(0.999999)
    })

    describe("decision", () => {

        it("never decides true if 0.0", () => {
            expect(random.decision(0)).toBeFalsy()
            expect(random.decision(0)).toBeFalsy()
            expect(random.decision(0)).toBeFalsy()
            expect(random.decision(0)).toBeFalsy()
        })

        it("sometimes decides true if 0.25", () => {
            expect(random.decision(0.25)).toBeTruthy()
            expect(random.decision(0.25)).toBeTruthy()
            expect(random.decision(0.25)).toBeFalsy()
            expect(random.decision(0.25)).toBeFalsy()
        })

        it("always decides true if 1.0", () => {
            expect(random.decision(1)).toBeTruthy()
            expect(random.decision(1)).toBeTruthy()
            expect(random.decision(1)).toBeTruthy()
            expect(random.decision(1)).toBeTruthy()
        })
    })
})
