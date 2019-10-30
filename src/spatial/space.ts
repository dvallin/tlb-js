import { Vector } from './vector'
import { Shape } from '../geometry/shape'

export interface Space<A> {
  get(pos: Vector): A | undefined
  set(pos: Vector, object: A): void
  setAll(shape: Shape, object: A): void
  remove(pos: Vector): A | undefined
}

export class DiscreteSpace<A> implements Space<A> {
  private readonly objects: A[]

  public constructor(public readonly width: number) {
    this.objects = new Array(width * width)
  }

  public get(pos: Vector): A | undefined {
    return this.objects[pos.index(this.width)]
  }

  public set(pos: Vector, object: A): void {
    this.objects[pos.index(this.width)] = object
  }

  public setAll(shape: Shape, object: A): void {
    shape.foreach(pos => this.set(pos, object))
  }

  public remove(pos: Vector): A | undefined {
    const index = pos.index(this.width)
    const oldValue = this.objects[index]
    delete this.objects[index]
    return oldValue
  }
}
