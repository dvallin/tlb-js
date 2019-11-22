import { Vector } from './vector'

export class Line {
  public constructor(public origin: Vector, public direction: Vector) {}

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

  public isEqual(line: Line): boolean {
    return this.side(line.origin) === 'inside' && this.side(line.origin.add(line.direction)) === 'inside'
  }
}
