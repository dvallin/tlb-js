import { Vector } from './vector'
import { Shape } from '../geometry/shape'
import { Tree, get, insert, remove } from './tree'

export interface Space<A> {
  get(pos: Vector): A | undefined
  set(pos: Vector, object: A): void
  setAll(shape: Shape, object: A): void
  remove(pos: Vector): A | undefined
}

export class DiscreteSpace<A> implements Space<A> {
  private readonly objects: Tree<A> = { values: [] }

  public get(pos: Vector): A | undefined {
    return get(this.objects, pos.coordinates)
  }

  public set(pos: Vector, object: A): void {
    insert(this.objects, pos.coordinates, object)
  }

  public setAll(shape: Shape, object: A): void {
    shape.foreach(pos => this.set(pos, object))
  }

  public remove(pos: Vector): A | undefined {
    return remove(this.objects, pos.coordinates)
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
