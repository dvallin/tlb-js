import { Vector } from './vector'

export class Line {
  public constructor(public readonly origin: Vector, public readonly direction: Vector) {}

  public side(point: Vector): 'left' | 'inside' | 'right' {
    const d = (point.x - this.origin.x) * this.direction.y - (point.y - this.origin.y) * this.direction.x
    if (d < 0) {
      return 'left'
    } else if (d === 0) {
      return 'inside'
    } else {
      return 'right'
    }
  }
}
