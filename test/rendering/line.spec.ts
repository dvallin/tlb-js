import { Vector2D } from "../../src/geometry/Vector2D"
import { toStream } from "../../src/rendering"
import { rasterize } from "../../src/rendering/line"

describe("line", () => {
    it("renders a single pixel if from equals to", () => {
        const p: Vector2D = new Vector2D(0, 0)
        expect(toStream(rasterize(p, p)).toArray()).toEqual([p])
    })

    it("renders a infinite pixels if from equals to and overshoot", () => {
        const p: Vector2D = new Vector2D(0, 0)
        const iter = rasterize(p, p, true)
        expect(iter()).toEqual(p)
        expect(iter()).toEqual(p)
    })

    it("renders along the positive x axis", () => {
        const from: Vector2D = new Vector2D(0, 0)
        const to: Vector2D = new Vector2D(2, 0)
        expect(toStream(rasterize(from, to)).toArray()).toEqual(
            [from, new Vector2D(1, 0), to]
        )
    })

    it("renders along the positive x axis and overshoots", () => {
        const from: Vector2D = new Vector2D(0, 0)
        const to: Vector2D = new Vector2D(2, 0)
        const iter = rasterize(from, to, true)
        expect(iter()).toEqual(from)
        expect(iter()).toEqual(new Vector2D(1, 0))
        expect(iter()).toEqual(to)
        expect(iter()).toEqual(new Vector2D(3, 0))
    })

    it("renders along the negative x axis", () => {
        const from: Vector2D = new Vector2D(0, 0)
        const to: Vector2D = new Vector2D(-2, 0)
        expect(toStream(rasterize(from, to)).toArray()).toEqual(
            [from, new Vector2D(-1, 0), to]
        )
    })

    it("renders along the negative x axis and overshoots", () => {
        const from: Vector2D = new Vector2D(0, 0)
        const to: Vector2D = new Vector2D(-1, 0)
        const iter = rasterize(from, to, true)
        expect(iter()).toEqual(from)
        expect(iter()).toEqual(to)
        expect(iter()).toEqual(new Vector2D(-2, 0))
        expect(iter()).toEqual(new Vector2D(-3, 0))
    })

    it("renders along the positive y axis", () => {
        const from: Vector2D = new Vector2D(0, 0)
        const to: Vector2D = new Vector2D(0, 2)
        expect(toStream(rasterize(from, to)).toArray()).toEqual(
            [from, new Vector2D(0, 1), to]
        )
    })

    it("renders along the negative y axis", () => {
        const from: Vector2D = new Vector2D(0, 0)
        const to: Vector2D = new Vector2D(0, -2)
        expect(toStream(rasterize(from, to)).toArray()).toEqual(
            [from, new Vector2D(0, -1), to]
        )
    })

    it("renders very steep", () => {
        const from: Vector2D = new Vector2D(0, 0)
        const to: Vector2D = new Vector2D(1, -10)
        const line = toStream(rasterize(from, to)).toArray()
        expect(line).toHaveLength(11)
        expect(line[0]).toEqual(from)
        expect(line[5].x).toBe(0)
        expect(line[6].x).toBe(1)
        expect(line[10]).toEqual(to)
    })

    it("renders very flat", () => {
        const from: Vector2D = new Vector2D(0, 0)
        const to: Vector2D = new Vector2D(-10, 1)
        const line = toStream(rasterize(from, to)).toArray()
        expect(line).toHaveLength(11)
        expect(line[0]).toEqual(from)
        expect(line[5].y).toBe(0)
        expect(line[6].y).toBe(1)
        expect(line[10]).toEqual(to)
    })
})

