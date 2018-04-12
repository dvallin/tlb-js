import { Direction } from "@/geometry/Direction"
import { Size } from "@/geometry/Size"

export class Position {

  public static from(facing: Direction): Position {
    let x: number = 0
    let y: number = 0
    switch (facing) {
      case Direction.West:
        x = -1
        break
      case Direction.East:
        x = +1
    }
    switch (facing) {
      case Direction.North:
        y = -1
        break
      case Direction.South:
        y = +1
    }
    return new Position(x, y)
  }

  public constructor(
    public x: number,
    public y: number
  ) { }

  public assign(position: Position): void {
    this.x = position.x
    this.y = position.y
  }

  public get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  public add(position: Position): Position {
    return new Position(this.x + position.x, this.y + position.y)
  }

  public subtract(position: Position): Position {
    return new Position(this.x - position.x, this.y - position.y)
  }

  public mult(scalar: number): Position {
    return new Position(this.x * scalar, this.y * scalar)
  }

  public scale(resize: Size): Position {
    return new Position(this.x * resize.width, this.y * resize.height)
  }

  public normal(): Position {
    return new Position(-this.y, this.x)
  }

  public normalize(): Position {
    const length = this.length
    if (length > 0) {
      return new Position(this.x / length, this.y / length)
    } else {
      return new Position(NaN, NaN)
    }
  }

  public round(): Position {
    return new Position(
      Math.fround(this.x),
      Math.fround(this.y)
    )
  }
}
