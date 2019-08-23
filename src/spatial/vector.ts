import { Direction } from './direction'

export class Vector {
  public static fromDirection(direction: Direction): Vector {
    switch (direction) {
      case 'up':
        return new Vector([0, -1])
      case 'right':
        return new Vector([1, 0])
      case 'down':
        return new Vector([0, 1])
      case 'left':
        return new Vector([-1, 0])
    }
  }

  public static interpolate(a: Vector, b: Vector, alpha: number): Vector {
    return a.add(b.minus(a).mult(alpha))
  }
  public readonly coordinates: [number, number]

  public constructor(coords: [number, number]) {
    this.coordinates = coords
  }

  public get key(): string {
    return this.coordinates.join(',')
  }

  public index(width: number): number {
    return (Math.floor(this.x) % width) + Math.floor(this.y) * width
  }

  public get center(): Vector {
    return this.add(new Vector([0.5, 0.25]))
  }

  public get x(): number {
    return this.coordinates[0]
  }

  public get y(): number {
    return this.coordinates[1]
  }

  public equals(other: Vector): boolean {
    return this.x === other.x && this.y === other.y
  }

  public add(other: Vector): Vector {
    return new Vector([this.x + other.x, this.y + other.y])
  }

  public minus(other: Vector): Vector {
    return new Vector([this.x - other.x, this.y - other.y])
  }

  public floor(): Vector {
    return new Vector([Math.floor(this.x), Math.floor(this.y)])
  }

  public mult(scale: number): Vector {
    return new Vector([this.x * scale, this.y * scale])
  }

  public abs(): Vector {
    return new Vector([Math.abs(this.x), Math.abs(this.y)])
  }

  public bounds(other: Vector): boolean {
    return Math.abs(other.x) < Math.abs(this.x) && Math.abs(other.y) < Math.abs(this.y)
  }

  public perpendicular(): Vector {
    return new Vector([-this.y, this.x])
  }

  public squaredLength(): number {
    return this.x * this.x + this.y * this.y
  }

  public length(): number {
    return Math.sqrt(this.squaredLength())
  }

  public l1(): number {
    return Math.abs(this.x) + Math.abs(this.y)
  }

  public lN(): number {
    return Math.max(Math.abs(this.x), Math.abs(this.y))
  }

  public normalize(): Vector {
    return this.mult(1.0 / this.length())
  }

  public isNan(): boolean {
    return Number.isNaN(this.x) || Number.isNaN(this.y)
  }
}
