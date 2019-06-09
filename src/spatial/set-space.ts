import { Vector } from './vector'
import { Shape } from '../geometry/shape'
import { Tree, get, insert, remove } from './tree'

export interface SetSpace {
  has(pos: Vector): boolean
  set(pos: Vector): void
  setAll(shape: Shape): void
  remove(pos: Vector): boolean
}

export class DiscreteSetSpace implements SetSpace {
  private readonly objects: Tree<{}> = { kind: 'root' }

  public has(pos: Vector): boolean {
    return get(this.objects, pos.coordinates) !== undefined
  }

  public set(pos: Vector): void {
    insert(this.objects, pos.coordinates, {})
  }

  public setAll(shape: Shape): void {
    shape.foreach(pos => this.set(pos))
  }

  public remove(pos: Vector): boolean {
    return remove(this.objects, pos.coordinates) !== undefined
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
