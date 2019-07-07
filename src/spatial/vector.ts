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
    Vector.assertHasSameDimensions(a, b)
    return a.add(b.minus(a).mult(alpha))
  }

  public static assertHasSameDimensions(v1: Vector, v2: Vector): void {
    if (v1.dimensions !== v2.dimensions) {
      throw new Error('dimension mismatch')
    }
  }

  public readonly coordinates: number[]

  public constructor(coords: number[]) {
    this.coordinates = coords
  }

  public get key(): string {
    return this.coordinates.join(',')
  }

  public get dimensions(): number {
    return this.coordinates.length
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

  public get z(): number {
    return this.coordinates[2]
  }

  public at(index: number): number {
    return this.coordinates[index]
  }

  public equals(other: Vector): boolean {
    if (other.dimensions !== this.dimensions) {
      return false
    }
    for (let i = 0; i < this.dimensions; i++) {
      if (this.at(i) !== other.at(i)) {
        return false
      }
    }
    return true
  }

  public add(other: Vector): Vector {
    Vector.assertHasSameDimensions(this, other)
    const result = new Array(this.dimensions)
    for (let i = 0; i < this.dimensions; i++) {
      result[i] = this.at(i) + other.at(i)
    }
    return new Vector(result)
  }

  public minus(other: Vector): Vector {
    Vector.assertHasSameDimensions(this, other)
    const result = new Array(this.dimensions)
    for (let i = 0; i < this.dimensions; i++) {
      result[i] = this.at(i) - other.at(i)
    }
    return new Vector(result)
  }

  public floor(): Vector {
    const result = new Array(this.dimensions)
    for (let i = 0; i < this.dimensions; i++) {
      result[i] = Math.floor(this.coordinates[i])
    }
    return new Vector(result)
  }

  public mult(scale: number): Vector {
    const result = new Array(this.dimensions)
    for (let i = 0; i < this.dimensions; i++) {
      result[i] = this.at(i) * scale
    }
    return new Vector(result)
  }

  public abs(): Vector {
    const result = new Array(this.dimensions)
    for (let i = 0; i < this.dimensions; i++) {
      result[i] = Math.abs(this.at(i))
    }
    return new Vector(result)
  }

  public bounds(other: Vector): boolean {
    Vector.assertHasSameDimensions(this, other)
    for (let i = 0; i < this.dimensions; i++) {
      if (Math.abs(other.at(i)) >= Math.abs(this.at(i))) {
        return false
      }
    }
    return true
  }

  public perpendicular(): Vector {
    if (this.dimensions !== 2) {
      throw new Error('wrong dimension')
    }
    return new Vector([-this.y, this.x])
  }

  public squaredLength(): number {
    let l = 0
    for (let i = 0; i < this.dimensions; i++) {
      l += this.at(i) * this.at(i)
    }
    return l
  }

  public length(): number {
    return Math.sqrt(this.squaredLength())
  }

  public l1(): number {
    let l = 0
    for (let i = 0; i < this.dimensions; i++) {
      l += Math.abs(this.at(i))
    }
    return l
  }

  public lN(): number {
    let l = 0
    for (let i = 0; i < this.dimensions; i++) {
      l = Math.max(l, Math.abs(this.at(i)))
    }
    return l
  }

  public normalize(): Vector {
    return this.mult(1.0 / this.length())
  }

  public isNan(): boolean {
    for (let i = 0; i < this.dimensions; i++) {
      if (Number.isNaN(this.at(i))) {
        return true
      }
    }
    return false
  }
}
