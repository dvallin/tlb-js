import { Vector2D } from "@/geometry/Vector2D"
import { RenderIterator } from "@/rendering"

export function rasterize(from: Vector2D, to: Vector2D, overshoot: boolean = false): RenderIterator {
    let delta = { x: Math.abs(to.x - from.x), y: Math.abs(to.y - from.y) }
    const sign = { x: Math.sign(to.x - from.x), y: Math.sign(to.y - from.y) }

    let swap = false
    if (delta.y > delta.x) {
        delta = { x: delta.y, y: delta.x }
        swap = true
    }

    let d = 2.0 * delta.y - delta.x
    let index = 0
    const current = { x: from.x, y: from.y }
    let done = false

    return () => {
        if (done) {
            return undefined
        }

        const result = new Vector2D(current.x, current.y)
        if (overshoot || index < delta.x) {
            while (d > 0) {
                d -= 2 * delta.x
                if (swap) {
                    current.x += sign.x
                } else {
                    current.y += sign.y
                }
            }
            d += 2 * delta.y
            if (swap) {
                current.y += sign.y
            } else {
                current.x += sign.x
            }
        } else {
            done = true
        }

        index += 1
        return result
    }
}
