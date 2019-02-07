import { Vector } from '../spatial/vector'
import { Rectangle } from './rectangle'

export interface Shape {
  bounds(): Rectangle
  containsVector(p: Vector): boolean
  contains(p: Shape): boolean
  foreach(f: (p: Vector) => void): void
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

  public foreach(f: (position: Vector) => void): void {
    this.all(p => {
      f(p)
      return true
    })
  }

  public some(f: (position: Vector) => boolean): boolean {
    return !this.all(p => {
      return !f(p)
    })
  }
}
