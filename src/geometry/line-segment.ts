import { AbstractShape } from './shape'
import { Vector } from '../spatial'
import { Rectangle } from './rectangle'
import { bresenham } from '../renderer/bresenham'

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
    const fromIter = bresenham(this.from, this.direction.mult(-1), true)
    const toIter = bresenham(this.to, this.direction, true)
    let from: Vector = fromIter()!
    let to: Vector = toIter()!
    for (let i = 0; i < cells; i++) {
      from = fromIter()!
      to = toIter()!
    }
    return new LineSegment(from, to)
  }

  public shrink(cells: number = 1): LineSegment {
    const fromIter = bresenham(this.from, this.direction, true)
    const toIter = bresenham(this.to, this.direction.mult(-1), true)
    let from: Vector = fromIter()!
    let to: Vector = toIter()!
    for (let i = 0; i < cells; i++) {
      from = fromIter()!
      to = toIter()!
    }
    return new LineSegment(from, to)
  }

  public all(f: (p: Vector) => boolean): boolean {
    const iter = bresenham(this.from, this.direction, false)
    while (true) {
      const p = iter()
      if (p === undefined) {
        return true
      }
      if (!f(p)) {
        return false
      }
    }
  }
}
