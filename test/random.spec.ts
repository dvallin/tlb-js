import { SeedableRandom } from "../src/random"

describe("SeedableRandom", () => {

    let random: SeedableRandom
    beforeEach(() => {
        random = new SeedableRandom("000")
    })

    describe("decision", () => {

        beforeEach(() => {
            random.rng.random = jest.fn()
                .mockReturnValueOnce(0.0)
                .mockReturnValueOnce(0.1)
                .mockReturnValueOnce(0.25)
                .mockReturnValueOnce(0.999999)
        })

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

    describe("weighted decision", () => {

        it("throws error if empty weights are given", () => {
            expect(() => random.weightedDecision([])).toThrowError("invalid input to weighted decision")
            expect(() => random.weightedDecision([0])).toThrowError("invalid input to weighted decision")
        })

        it("decides for the single option", () => {
            expect(random.weightedDecision([1])).toEqual(0)
        })

        it("picks a random item", () => {
            const spy = jest.spyOn(random.rng, "intBetween")
            expect(random.weightedDecision([1, 2, 1])).toEqual(2)
            expect(spy).toHaveBeenCalledWith(0, 3)
        })
    })

    describe("integerBetween", () => {

        it("returns a random integer", () => {
            const spy = jest.spyOn(random.rng, "intBetween")
            expect(random.integerBetween(0, 3)).toEqual(3)
            expect(spy).toHaveBeenCalledWith(0, 3)
        })
    })

    describe("pick", () => {

        it("works on empty arrays", () => {
            const array: number[] = []
            const element = random.pick(array)
            expect(element).toBeUndefined()
        })

        it("picks random element from  array", () => {
            const array: number[] = [0, 1, 2, 3, 4, 5]
            const element = random.pick(array)
            expect(element).toEqual(4)
        })
    })

    describe("shuffle", () => {

        it("works on empty arrays", () => {
            const array: number[] = []
            random.shuffle(array)
            expect(array).toEqual([])
        })

        it("shuffles arrays", () => {
            const array: number[] = [0, 1, 2, 3, 4, 5]
            random.shuffle(array)
            expect(array).toEqual([0, 3, 5, 1, 2, 4])
        })
    })
})
