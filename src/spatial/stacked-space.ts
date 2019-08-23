import { Shape } from '../geometry/shape'
import { Vector } from './vector'

export interface StackedSpace<A> {
  get(pos: Vector): A[]
  set(pos: Vector, objects: A[]): void

  add(pos: Vector, object: A): void
  addAll(shape: Shape, object: A): void
  retain(pos: Vector, predicate: (a: A) => boolean): void
}

export class DiscreteStackedSpace<A> implements StackedSpace<A> {
  private readonly objects: A[][]

  public constructor(public readonly width: number) {
    this.objects = new Array(width * width)
  }

  public get(pos: Vector): A[] {
    return this.objects[pos.index(this.width)] || []
  }

  public set(pos: Vector, objects: A[]): void {
    this.objects[pos.index(this.width)] = objects
  }

  public add(pos: Vector, object: A): void {
    const index = pos.index(this.width)
    let values = this.objects[index]
    if (values === undefined) {
      values = []
      this.objects[index] = values
    }
    values.push(object)
  }

  public addAll(shape: Shape, object: A): void {
    shape.foreach(pos => this.add(pos, object))
  }

  public retain(pos: Vector, predicate: (a: A) => boolean): void {
    const index = pos.index(this.width)
    const o = this.objects[index]
    if (o !== undefined) {
      this.objects[index] = o.filter(o => predicate(o))
    }
  }
}
