import { Shape, AbstractShape } from './shape'
import { Rectangle } from './rectangle'
import { Vector } from '../spatial/vector'

export class Difference extends AbstractShape {
  public static innerBorder(shape: Shape): Difference {
    return new Difference(shape, shape.shrink())
  }

  public constructor(public readonly baseShape: Shape, public readonly subtractionShape: Shape) {
    super()
  }

  public bounds(): Rectangle {
    return this.baseShape.bounds()
  }

  public containsVector(p: Vector): boolean {
    return this.baseShape.containsVector(p) && !this.subtractionShape.containsVector(p)
  }

  public grow(cells: number = 1): Difference {
    return new Difference(this.baseShape.grow(cells), this.subtractionShape.grow(cells))
  }

  public shrink(cells: number = 1): Difference {
    return new Difference(this.baseShape.shrink(cells), this.subtractionShape.shrink(cells))
  }

  public translate(t: Vector): Difference {
    return new Difference(this.baseShape.translate(t), this.subtractionShape.translate(t))
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
