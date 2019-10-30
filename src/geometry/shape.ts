import { Vector } from '../spatial/vector'
import { Rectangle } from './rectangle'

export interface Shape {
  bounds(): Rectangle
  containsVector(p: Vector): boolean
  contains(s: Shape): boolean
  equals(s: Shape): boolean
  foreach(f: (p: Vector, i: number) => void): void
  all(f: (p: Vector) => boolean): boolean
  some(predicate: (p: Vector) => boolean): boolean
  translate(t: Vector): Shape
  grow(cells?: number): Shape
  shrink(cells?: number): Shape
}

export abstract class AbstractShape implements Shape {
  public abstract bounds(): Rectangle
  public abstract containsVector(p: Vector): boolean
  public abstract all(f: (p: Vector) => boolean): boolean
  public abstract translate(t: Vector): Shape
  public abstract grow(cells?: number): Shape
  public abstract shrink(cells?: number): Shape

  public contains(s: Shape): boolean {
    return s.all(p => this.containsVector(p))
  }
  public equals(s: Shape): boolean {
    return this.contains(s) && s.contains(this)
  }

  public foreach(f: (position: Vector, i: number) => void): void {
    let i = 0
    this.all(p => {
      f(p, i)
      i++
      return true
    })
  }

  public some(f: (position: Vector) => boolean): boolean {
    return !this.all(p => {
      return !f(p)
    })
  }
}
