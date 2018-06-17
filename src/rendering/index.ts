import { Vector2D } from "@/geometry/Vector2D"
import LazyJS from "lazy.js"

export type RenderIterator = () => Vector2D | undefined

export function toStream(iter: RenderIterator): LazyJS.Sequence<Vector2D> {
    return LazyJS.generate(iter)
        .takeWhile((p: Vector2D | undefined) => p !== undefined)
        .map(p => p as Vector2D)
}

export function toArray(iter: RenderIterator): Vector2D[] {
    const array = []
    while (true) {
        const p: Vector2D | undefined = iter()
        if (p === undefined) {
            return array
        }
        array.push(p)
    }
}

export function foreach(iter: RenderIterator, callback: (p: Vector2D) => void): void {
    while (true) {
        const p: Vector2D | undefined = iter()
        if (p === undefined) {
            return
        }
        callback(p)
    }
}
