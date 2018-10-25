import { Vector } from "src/spatial"
import { Rectangle } from "./rectangle"

export interface Shape {
    bounds(): Rectangle
    contains(p: Vector): boolean
    foreach(f: (p: Vector) => void): void
    takeWhile(f: (p: Vector) => boolean): boolean
}
