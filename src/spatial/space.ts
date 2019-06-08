import { Vector } from './vector'
import { Shape } from '../geometry/shape'
import { Root, get, insert, Leaf } from './tree'

export interface Space<A> {
  get(pos: Vector): A | undefined
  set(pos: Vector, object: A): void
  setAll(shape: Shape, object: A): void
  remove(pos: Vector): A | undefined
}

export class DiscreteSpace<A> implements Space<A> {
  private readonly objects: Root<A> = { kind: 'root' }

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
    let root: Root<A> = this.objects
    for (let d = 0; d < pos.dimensions - 1; d++) {
      let leaf: Leaf<A> | Root<A> | undefined = root[pos.at(d)]
      if (leaf === undefined) {
        return undefined
      } else if (leaf.kind === 'root') {
        root = leaf
      } else {
        throw Error()
      }
    }
    const leaf = root[pos.at(pos.dimensions - 1)] as Leaf<A>
    const value = leaf.value
    delete root[pos.at(pos.dimensions - 1)]
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
