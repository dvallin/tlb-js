import { Shape } from "./shape"
import { Rectangle } from "./rectangle"
import { Vector } from "src/spatial"

export class Union implements Shape {

    public constructor(
        public readonly shape1: Shape,
        public readonly shape2: Shape
    ) { }

    public bounds(): Rectangle {
        return this.shape1.bounds().plus(this.shape2.bounds())
    }

    public contains(p: Vector): boolean {
        return this.shape1.contains(p) || this.shape2.contains(p)
    }

    public foreach(f: (p: Vector) => void): void {
        this.takeWhile(p => {
            f(p)
            return true
        })
    }

    public takeWhile(f: (p: Vector) => boolean): boolean {
        return this.bounds().takeWhile(p => {
            if (this.contains(p)) {
                return f(p)
            }
            return true
        })
    }
}
