import { Vector } from './vector'
import { Shape } from '../geometry/shape'

export interface Space<A> {
  get(pos: Vector): A | undefined
  set(pos: Vector, object: A): void
  setAll(shape: Shape, object: A): void
  remove(pos: Vector): A | undefined
}

export class DiscreteSpace<A> implements Space<A> {
  private readonly objects: Map<string, A> = new Map()

  public get(pos: Vector): A | undefined {
    return this.objects.get(pos.key)
  }

  public set(pos: Vector, object: A): void {
    this.objects.set(pos.key, object)
  }

  public setAll(shape: Shape, object: A): void {
    shape.foreach(pos => this.set(pos, object))
  }

  public remove(pos: Vector): A | undefined {
    const key = pos.key
    const value = this.objects.get(key)
    this.objects.delete(key)
    return value
  }
}

export class SubSpace<A> implements Space<A> {
  public constructor(public readonly space: Space<A>, public readonly transform: (pos: Vector) => Vector) {}

  public get(pos: Vector): A | undefined {
    return this.space.get(this.transform(pos))
  }

  public set(pos: Vector, object: A): void {
    return this.space.set(this.transform(pos), object)
  }

  public setAll(shape: Shape, object: A): void {
    shape.foreach(pos => this.set(pos, object))
  }

  public remove(pos: Vector): A | undefined {
    return this.space.remove(this.transform(pos))
  }
}
