import { Vector } from "../../src/geometry/Vector"
import { Rectangle } from "../../src/geometry/Rectangle"
import { toStream } from "../../src/rendering"
import { rasterize } from "../../src/rendering/rectangle"

describe("rectangle", () => {
    it("renders a single pixel if empty", () => {
        const r: Rectangle = Rectangle.from(new Vector([0, 0]), new Vector([0, 0]))
        expect(toStream(rasterize(r)).toArray()).toEqual([new Vector([0, 0])])
    })

    it("renders a line if height is zero", () => {
        const r: Rectangle = Rectangle.from(new Vector([0, 0]), new Vector([2, 0]))
        expect(toStream(rasterize(r)).toArray()).toEqual([new Vector([0, 0]), new Vector([1, 0]), new Vector([2, 0])])
    })

    it("renders a line if width is zero", () => {
        const r: Rectangle = Rectangle.from(new Vector([0, 0]), new Vector([0, 2]))
        expect(toStream(rasterize(r)).toArray()).toEqual([new Vector([0, 0]), new Vector([0, 1]), new Vector([0, 2])])
    })

    it("renders only the borders of the rectangle by default", () => {
        const r: Rectangle = Rectangle.from(new Vector([0, 0]), new Vector([2, 2]))
        expect(toStream(rasterize(r)).toArray()).toEqual([
            new Vector([0, 0]), new Vector([1, 0]), new Vector([2, 0]),
            new Vector([0, 1]), new Vector([2, 1]),
            new Vector([0, 2]), new Vector([1, 2]), new Vector([2, 2])
        ])
    })

    it("renders a full rectangle", () => {
        const r: Rectangle = Rectangle.from(new Vector([0, 0]), new Vector([2, 2]))
        expect(toStream(rasterize(r, true)).toArray()).toEqual([
            new Vector([0, 0]), new Vector([1, 0]), new Vector([2, 0]),
            new Vector([0, 1]), new Vector([1, 1]), new Vector([2, 1]),
            new Vector([0, 2]), new Vector([1, 2]), new Vector([2, 2])
        ])
    })
})

