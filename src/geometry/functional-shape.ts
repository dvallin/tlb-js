import { AbstractShape } from './shape'
import { Vector } from '../spatial'
import { Rectangle } from './rectangle'

export class FunctionalShape extends AbstractShape {
  public static lN(position: Vector, size: number = 1, center: boolean = false): FunctionalShape {
    return FunctionalShape.fromMeasure(position, size, center, d => d.lN() <= size)
  }

  public static l1(position: Vector, size: number = 1, center: boolean = false): FunctionalShape {
    return FunctionalShape.fromMeasure(position, size, center, d => d.l1() <= size)
  }

  public static l2(position: Vector, size: number = 1, center: boolean = false): FunctionalShape {
    return FunctionalShape.fromMeasure(position, size, center, d => d.squaredLength() <= size * size)
  }

  public static fromMeasure(position: Vector, size: number, center: boolean, measure: (d: Vector) => boolean) {
    const boundary = Rectangle.centerAt(position.x, position.y, size)
    return new FunctionalShape(p => {
      const d = p.minus(position).abs()
      if (d.fX === 0 && d.fY === 0) {
        return center
      }
      return measure(d)
    }, boundary)
  }

  public constructor(private readonly f: (p: Vector) => boolean, private readonly boundary: Rectangle) {
    super()
  }

  public bounds(): Rectangle {
    return this.boundary
  }

  public containsVector(p: Vector): boolean {
    return this.f(p)
  }

  public translate(t: Vector): FunctionalShape {
    return new FunctionalShape(p => this.f(p.add(t)), this.boundary.translate(t))
  }

  public grow(): FunctionalShape {
    // Todo
    return this
  }

  public shrink(): FunctionalShape {
    // Todo
    return this
  }

  public all(f: (position: Vector) => boolean): boolean {
    return this.boundary.all(p => !this.f(p) || f(p))
  }
}
