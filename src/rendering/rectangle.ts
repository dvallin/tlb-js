import { Rectangle } from "@/geometry/Rectangle"
import { Position } from "@/geometry/Position"
import { RenderIterator } from "@/rendering"

export function rasterize(rectangle: Rectangle, fill: boolean = false): RenderIterator {
    let y = rectangle.top
    let x = rectangle.left
    let done = false

    return () => {
        if (done) {
            return undefined
        }
        const result = new Position(Math.floor(x), Math.floor(y))
        x++
        if (x > rectangle.right) {
            x = rectangle.left
            y++
        }
        if (!fill && x > rectangle.left && y !== rectangle.top && y !== rectangle.bottom) {
            x = rectangle.right
        }
        if (y > rectangle.bottom) {
            done = true
        }
        return result
    }
}
