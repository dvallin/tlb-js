import { Shape } from '../geometry/shape'
import { Vector } from './vector'
import { Root, get, insert, getLeaf } from './tree'

export interface StackedSpace<A> {
  get(pos: Vector): A[]
  set(pos: Vector, objects: A[]): void

  add(pos: Vector, object: A): void
  addAll(shape: Shape, object: A): void
  retain(pos: Vector, predicate: (a: A) => boolean): void
}

export class DiscreteStackedSpace<A> implements StackedSpace<A> {
  private readonly objects: Root<A[]> = { kind: 'root' }

  public get(pos: Vector): A[] {
    return get(this.objects, pos.coordinates) || []
  }

  public set(pos: Vector, objects: A[]): void {
    insert(this.objects, pos.coordinates, objects)
  }

  public add(pos: Vector, object: A): void {
    const leaf = getLeaf(this.objects, pos.coordinates)
    if (leaf !== undefined) {
      leaf.value.push(object)
    } else {
      this.set(pos, [object])
    }
  }

  public addAll(shape: Shape, object: A): void {
    shape.foreach(pos => this.add(pos, object))
  }

  public retain(pos: Vector, predicate: (a: A) => boolean): void {
    const leaf = getLeaf(this.objects, pos.coordinates)
    if (leaf !== undefined) {
      leaf.value = leaf.value.filter(o => predicate(o))
    }
  }
}

export class SubStackedSpace<A> implements StackedSpace<A> {
  public constructor(public readonly space: StackedSpace<A>, public readonly transform: (pos: Vector) => Vector) {}

  public get(pos: Vector): A[] {
    return this.space.get(this.transform(pos))
  }

  public set(pos: Vector, objects: A[]): void {
    return this.space.set(this.transform(pos), objects)
  }

  public add(pos: Vector, object: A): void {
    return this.space.add(this.transform(pos), object)
  }

  public addAll(shape: Shape, object: A): void {
    shape.foreach(pos => this.add(pos, object))
  }

  public retain(pos: Vector, predicate: (a: A) => boolean): void {
    return this.space.retain(this.transform(pos), predicate)
  }
}
