import { Vector } from "../spatial/vector"
import { Rectangle } from "./rectangle"

export interface Shape {
    bounds(): Rectangle
    containsVector(p: Vector): boolean
    contains(p: Shape): boolean
    foreach(f: (p: Vector) => void): void
    takeWhile(f: (p: Vector) => boolean): boolean
    translate(t: Vector): Shape
    grow(): Shape
}

export abstract class AbstractShape implements Shape {

    public abstract bounds(): Rectangle
    public abstract containsVector(p: Vector): boolean
    public abstract takeWhile(f: (p: Vector) => boolean): boolean
    public abstract translate(t: Vector): Shape
    public abstract grow(): Shape

    public contains(s: Shape): boolean {
        return s.takeWhile(p => this.containsVector(p))
    }

    public foreach(f: (position: Vector) => void): void {
        this.takeWhile(p => {
            f(p)
            return true
        })
    }
}
