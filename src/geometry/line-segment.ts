import { AbstractShape } from './shape'
import { Vector } from '../spatial'
import { Rectangle } from './rectangle'
import { bresenham } from '../renderer/bresenham'
import { skip, head } from '../iter-utils'

export class LineSegment extends AbstractShape {
  public constructor(public readonly from: Vector, public readonly to: Vector) {
    super()
  }

  public get direction(): Vector {
    return this.to.minus(this.from)
  }

  public bounds(): Rectangle {
    return new Rectangle(
      Math.min(this.from.x, this.to.x),
      Math.min(this.from.y, this.to.y),
      Math.abs(this.from.x - this.to.x),
      Math.abs(this.from.y - this.to.y)
    )
  }

  public translate(t: Vector): LineSegment {
    return new LineSegment(this.from.add(t), this.to.add(t))
  }

  public containsVector(p: Vector): boolean {
    return this.some(l => p.equals(l))
  }

  public grow(cells: number = 1): LineSegment {
    return new LineSegment(
      head(skip(bresenham(this.from, this.direction.mult(-1), true), cells))!,
      head(skip(bresenham(this.to, this.direction, true), cells))!
    )
  }

  public shrink(cells: number = 1): LineSegment {
    return new LineSegment(
      head(skip(bresenham(this.from, this.direction, true), cells))!,
      head(skip(bresenham(this.to, this.direction.mult(-1), true), cells))!
    )
  }

  public all(f: (p: Vector) => boolean): boolean {
    for (const p of bresenham(this.from, this.direction, false)) {
      if (!f(p)) {
        return false
      }
    }
    return true
  }
}
