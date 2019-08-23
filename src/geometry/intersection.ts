import { Shape, AbstractShape } from './shape'
import { Rectangle } from './rectangle'
import { Vector } from '../spatial/vector'

export class Intersection extends AbstractShape {
  public constructor(public readonly a: Shape, public readonly b: Shape) {
    super()
  }

  public bounds(): Rectangle {
    return this.a.bounds().intersect(this.b.bounds())
  }

  public containsVector(p: Vector): boolean {
    return this.a.containsVector(p) && this.b.containsVector(p)
  }

  public grow(cells: number = 1): Intersection {
    return new Intersection(this.a.grow(cells), this.b.grow(cells))
  }

  public shrink(cells: number = 1): Intersection {
    return new Intersection(this.a.shrink(cells), this.b.shrink(cells))
  }

  public translate(t: Vector): Intersection {
    return new Intersection(this.a.translate(t), this.b.translate(t))
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
