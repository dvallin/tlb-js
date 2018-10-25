import { Rectangle } from "../../src/geometry/rectangle"
import { Vector } from "../../src/spatial"

describe("Rectangle", () => {
    const empty = new Rectangle(0, 0, 0, 0)
    const single = new Rectangle(0, 0, 1, 1)

    describe("empty rectangle", () => {

        it("has correct bounds", () => {
            expect(empty.left).toBe(0)
            expect(empty.right).toBe(-1)
            expect(empty.top).toBe(0)
            expect(empty.bottom).toBe(-1)
        })

        it("has correct containment", () => {
            expect(empty.contains(new Vector(0, 0))).toBeFalsy()
            expect(empty.contains(new Vector(1, 0))).toBeFalsy()
            expect(empty.contains(new Vector(0, 1))).toBeFalsy()
            expect(empty.contains(new Vector(1, 1))).toBeFalsy()
        })

        it("iterates", () => {
            const elements: Vector[] = []
            empty.foreach(f => elements.push(f))
            expect(elements).toEqual([])
        })
    })

    describe("single cell rectangle", () => {

        it("can be created from bounds", () => {
            expect(Rectangle.fromBounds(0, 0, 0, 0)).toEqual(new Rectangle(0, 0, 1, 1))
        })

        it("has correct bounds", () => {
            expect(single.left).toBe(0)
            expect(single.right).toBe(0)
            expect(single.top).toBe(0)
            expect(single.bottom).toBe(0)
        })

        it("has correct containment", () => {
            expect(single.contains(new Vector(0, 0))).toBeTruthy()
            expect(single.contains(new Vector(1, 0))).toBeFalsy()
            expect(single.contains(new Vector(0, 1))).toBeFalsy()
            expect(single.contains(new Vector(1, 1))).toBeFalsy()
        })

        it("iterates", () => {
            const elements: Vector[] = []
            single.foreach(f => elements.push(f))
            expect(elements).toEqual([new Vector(0, 0)])
        })
    })

    describe("bounds", () => {
        it("is already its own bound", () => {
            expect(empty.bounds()).toEqual(empty)
            expect(single.bounds()).toEqual(single)
        })
    })

    describe("takeWhile", () => {

        it("breaks when false is returned", () => {
            const large = new Rectangle(0, 0, 1000, 1000)
            const elements: Vector[] = []
            large.takeWhile(f => {
                elements.push(f)
                return false
            })
            expect(elements).toEqual([new Vector(0, 0)])
        })
    })

    describe("plus", () => {

        it("adds single and empty cell", () => {
            expect(single.plus(empty)).toEqual(single)
            expect(empty.plus(single)).toEqual(single)
        })

        it("adds overlapping rectangles", () => {
            expect(new Rectangle(0, 0, 2, 2).plus(new Rectangle(1, 1, 2, 2))).toEqual(new Rectangle(0, 0, 3, 3))
        })

        it("adds non overlapping rectangles", () => {
            expect(new Rectangle(0, 0, 2, 2).plus(new Rectangle(4, 4, 2, 2))).toEqual(new Rectangle(0, 0, 6, 6))
        })
    })
})
