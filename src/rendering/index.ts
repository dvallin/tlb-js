import { Vector } from "@/geometry/Vector"
import * as LazyJS from "lazy.js"

export type RenderIterator = () => Vector | undefined

export function toStream(iter: RenderIterator): LazyJS.Sequence<Vector> {
    return LazyJS.generate(iter)
        .takeWhile((p: Vector | undefined) => p !== undefined)
        .map(p => p as Vector)
}

export function toArray(iter: RenderIterator): Vector[] {
    const array = []
    while (true) {
        const p: Vector | undefined = iter()
        if (p === undefined) {
            return array
        }
        array.push(p)
    }
}

export function foreach(iter: RenderIterator, callback: (p: Vector) => void): void {
    while (true) {
        const p: Vector | undefined = iter()
        if (p === undefined) {
            return
        }
        callback(p)
    }
}
