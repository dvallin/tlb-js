import { AbstractShape } from './shape'
import { Vector } from '../spatial'
import { Direction } from '../spatial/direction'

export class Rectangle extends AbstractShape {
  public static fromBounds(left: number, right: number, top: number, bottom: number): Rectangle {
    return new Rectangle(left, top, right - left + 1, bottom - top + 1)
  }

  public static footprint(position: Vector, direction: Direction, size: Vector): Rectangle {
    const up: Vector = Vector.fromDirection(direction).abs()
    const right: Vector = Vector.fromDirection(direction)
      .perpendicular()
      .abs()
    const cx = Math.floor(size.x / 2)
    const cy = Math.floor(size.y / 2)
    const topLeft = position.add(right.mult(-cx)).add(up.mult(-cy))
    const bottomRight = topLeft.add(right.mult(size.x - 1)).add(up.mult(size.y - 1))
    return Rectangle.fromBounds(topLeft.x, bottomRight.x, topLeft.y, bottomRight.y)
  }

  public static centerAt(x: number, y: number, size: number): Rectangle {
    return new Rectangle(x - size, y - size, 2 * size + 1, 2 * size + 1)
  }

  public constructor(public readonly x: number, public readonly y: number, public readonly width: number, public readonly height: number) {
    super()
  }

  public get left(): number {
    return this.x
  }

  public get right(): number {
    return this.x + this.width - 1
  }

  public get top(): number {
    return this.y
  }

  public get bottom(): number {
    return this.y + this.height - 1
  }

  public get topLeft(): Vector {
    return new Vector([this.left, this.top])
  }

  public get topRight(): Vector {
    return new Vector([this.right, this.top])
  }

  public get bottomRight(): Vector {
    return new Vector([this.right, this.bottom])
  }

  public get bottomLeft(): Vector {
    return new Vector([this.left, this.bottom])
  }

  public get center(): Vector {
    const cx = (this.left + this.right) / 2
    const cy = (this.top + this.bottom) / 2
    return new Vector([Math.floor(cx), Math.floor(cy)])
  }

  public centerOf(direction: Direction): Vector {
    switch (direction) {
      case 'up':
        return this.centerTop
      case 'right':
        return this.centerRight
      case 'down':
        return this.centerBottom
      case 'left':
        return this.centerLeft
    }
  }

  public get centerLeft(): Vector {
    const cy = (this.top + this.bottom) / 2
    return new Vector([this.left, Math.floor(cy)])
  }

  public get centerRight(): Vector {
    const cy = (this.top + this.bottom) / 2
    return new Vector([this.right, Math.floor(cy)])
  }

  public get centerTop(): Vector {
    const cx = (this.left + this.right) / 2
    return new Vector([Math.floor(cx), this.top])
  }

  public get centerBottom(): Vector {
    const cx = (this.left + this.right) / 2
    return new Vector([Math.floor(cx), this.bottom])
  }

  public plus(other: Rectangle): Rectangle {
    return Rectangle.fromBounds(
      Math.min(this.left, other.left),
      Math.max(this.right, other.right),
      Math.min(this.top, other.top),
      Math.max(this.bottom, other.bottom)
    )
  }

  public intersect(other: Rectangle): Rectangle {
    return Rectangle.fromBounds(
      Math.max(this.left, other.left),
      Math.min(this.right, other.right),
      Math.max(this.top, other.top),
      Math.min(this.bottom, other.bottom)
    )
  }

  public cover(other: Vector): Rectangle {
    return Rectangle.fromBounds(
      Math.min(this.left, other.x),
      Math.max(this.right, other.x),
      Math.min(this.top, other.y),
      Math.max(this.bottom, other.y)
    )
  }

  public bounds(): Rectangle {
    return this
  }

  public containsVector(p: Vector): boolean {
    return p.x >= this.x && p.x < this.x + this.width && p.y >= this.y && p.y < this.y + this.height
  }

  public translate(t: Vector): Rectangle {
    return new Rectangle(this.x + t.x, this.y + t.y, this.width, this.height)
  }

  public grow(cells: number = 1): Rectangle {
    return new Rectangle(this.x - cells, this.y - cells, this.width + 2 * cells, this.height + 2 * cells)
  }

  public shrink(cells: number = 1): Rectangle {
    const w = this.width - 2 * cells
    const h = this.height - 2 * cells
    return new Rectangle(w > 0 ? this.x + cells : this.x, h > 0 ? this.y + cells : this.y, w > 0 ? w : 0, h > 0 ? h : 0)
  }

  public all(f: (position: Vector) => boolean): boolean {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const position = new Vector([j + this.x, i + this.y])
        if (!f(position)) {
          return false
        }
      }
    }
    return true
  }
}
