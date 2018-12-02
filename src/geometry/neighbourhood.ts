import { AbstractShape } from "./shape"
import { Vector } from "../spatial"
import { Rectangle } from "./rectangle"

export class Neighbourhood extends AbstractShape {

    public static L1(position: Vector, size: number = 1): Neighbourhood {
        return new Neighbourhood(position.x, position.y, size)
    }

    public constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly size: number
    ) {
        super()
    }

    public bounds(): Rectangle {
        return new Rectangle(this.x, this.y, this.size, this.size)
    }

    public containsVector(p: Vector): boolean {
        if (p.x === this.x && p.y === this.y) {
            return false
        }
        return this.bounds().containsVector(p)
    }

    public translate(t: Vector): Neighbourhood {
        return new Neighbourhood(this.x + t.x, this.y + t.y, this.size)
    }

    public grow(): Neighbourhood {
        return new Neighbourhood(this.x, this.y, this.size + 1)
    }

    public all(f: (position: Vector) => boolean): boolean {
        for (let i = -this.size; i <= this.size; i++) {
            for (let j = -this.size; j <= this.size; j++) {
                const position = new Vector(j + this.x, i + this.y)
                if (position.x === this.x && position.y === this.y) {
                    continue
                }
                if (!f(position)) {
                    return false
                }
            }
        }
        return true
    }
}
