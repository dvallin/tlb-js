import { Vector } from './vector'
import { Shape } from '../geometry/shape'

export interface SetSpace {
  has(pos: Vector): boolean
  set(pos: Vector): void
  setAll(shape: Shape): void
  remove(pos: Vector): boolean
}

export class DiscreteSetSpace implements SetSpace {
  private readonly objects: Set<string> = new Set()

  public has(pos: Vector): boolean {
    return this.objects.has(pos.key)
  }

  public set(pos: Vector): void {
    this.objects.add(pos.key)
  }

  public setAll(shape: Shape): void {
    shape.foreach(pos => this.set(pos))
  }

  public remove(pos: Vector): boolean {
    const key = pos.key
    const value = this.objects.has(key)
    this.objects.delete(key)
    return value
  }
}

export class SubSetSpace implements SetSpace {
  public constructor(public readonly space: SetSpace, public readonly transform: (pos: Vector) => Vector) {}

  public has(pos: Vector): boolean {
    return this.space.has(this.transform(pos))
  }

  public set(pos: Vector): void {
    return this.space.set(this.transform(pos))
  }

  public setAll(shape: Shape): void {
    shape.foreach(pos => this.set(pos))
  }

  public remove(pos: Vector): boolean {
    return this.space.remove(this.transform(pos))
  }
}
