import { Vector } from './vector'
import { Shape } from '../geometry/shape'

export interface SetSpace {
  has(pos: Vector): boolean
  set(pos: Vector): void
  setAll(shape: Shape): void
  remove(pos: Vector): boolean
}

export class DiscreteSetSpace implements SetSpace {
  private readonly objects: Uint8Array

  public constructor(public readonly width: number) {
    this.objects = new Uint8Array(width * width)
  }

  public has(pos: Vector): boolean {
    return this.objects[pos.index(this.width)] > 0
  }

  public set(pos: Vector): void {
    this.objects[pos.index(this.width)] = 1
  }

  public setAll(shape: Shape): void {
    shape.foreach(pos => this.set(pos))
  }

  public remove(pos: Vector): boolean {
    const index = pos.index(this.width)
    const oldValue = this.objects[index]
    this.objects[index] = 0
    return oldValue > 0
  }
}
