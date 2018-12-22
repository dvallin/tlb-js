import { Random } from "../../src/random"
import { Distribution, Uniform } from "../../src/random/distributions"

describe("Random", () => {

    let random: Random
    let distribution: Distribution
    beforeEach(() => {
        distribution = new Uniform("000")
        random = new Random(distribution)
    })

    describe("decision", () => {

        beforeEach(() => {
            distribution.sample = jest.fn()
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
            expect(random.weightedDecision([1, 2, 1])).toEqual(2)
        })
    })

    describe("integerBetween", () => {

        it("returns a random integer", () => {
            expect(random.integerBetween(0, 3)).toEqual(3)
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
