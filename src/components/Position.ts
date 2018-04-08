import { Direction } from "@/components/Direction"
import { Size } from "@/components/Size"

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

  public add(position: Position): Position {
    return new Position(this.x + position.x, this.y + position.y)
  }

  public mult(scalar: number): Position {
    return new Position(Math.floor(this.x * scalar), Math.floor(this.y * scalar))
  }

  public scale(resize: Size): Position {
    return new Position(Math.floor(this.x * resize.width), Math.floor(this.y * resize.height))
  }

  public normal(): Position {
    return new Position(-this.y, this.x)
  }
}
