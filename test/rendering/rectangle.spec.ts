import { Position } from "@/components/Position"
import { Rectangle } from "@/geometry/Rectangle"
import { toStream } from "@/rendering"
import { rasterize } from "@/rendering/rectangle"

describe("rectangle", () => {
    it("renders a single pixel if empty", () => {
        const r: Rectangle = new Rectangle(0, 0, 0, 0)
        expect(toStream(rasterize(r)).toArray()).toEqual([new Position(0, 0)])
    })

    it("renders a line if height is zero", () => {
        const r: Rectangle = new Rectangle(0, 2, 0, 0)
        expect(toStream(rasterize(r)).toArray()).toEqual([new Position(0, 0), new Position(1, 0), new Position(2, 0)])
    })

    it("renders a line if width is zero", () => {
        const r: Rectangle = new Rectangle(0, 0, 0, 2)
        expect(toStream(rasterize(r)).toArray()).toEqual([new Position(0, 0), new Position(0, 1), new Position(0, 2)])
    })

    it("renders only the borders of the rectangle by default", () => {
        const r: Rectangle = new Rectangle(0, 2, 0, 2)
        expect(toStream(rasterize(r)).toArray()).toEqual([
            new Position(0, 0), new Position(1, 0), new Position(2, 0),
            new Position(0, 1), new Position(2, 1),
            new Position(0, 2), new Position(1, 2), new Position(2, 2)
        ])
    })

    it("renders a full rectangle", () => {
        const r: Rectangle = new Rectangle(0, 2, 0, 2)
        expect(toStream(rasterize(r, true)).toArray()).toEqual([
            new Position(0, 0), new Position(1, 0), new Position(2, 0),
            new Position(0, 1), new Position(1, 1), new Position(2, 1),
            new Position(0, 2), new Position(1, 2), new Position(2, 2)
        ])
    })
})

