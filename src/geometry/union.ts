import { Shape, AbstractShape } from "./shape"
import { Rectangle } from "./rectangle"
import { Vector } from "../spatial/vector"

export class Union extends AbstractShape {

    public constructor(
        public readonly shape1: Shape,
        public readonly shape2: Shape
    ) {
        super()
    }

    public bounds(): Rectangle {
        return this.shape1.bounds().plus(this.shape2.bounds())
    }

    public containsVector(p: Vector): boolean {
        return this.shape1.containsVector(p) || this.shape2.containsVector(p)
    }

    public grow(): Union {
        return new Union(
            this.shape1.grow(),
            this.shape2.grow()
        )
    }

    public translate(t: Vector): Union {
        return new Union(
            this.shape1.translate(t),
            this.shape2.translate(t)
        )
    }

    public all(f: (p: Vector) => boolean): boolean {
        return this.bounds().all(p => {
            if (this.containsVector(p)) {
                return f(p)
            }
            return true
        })
    }
}
