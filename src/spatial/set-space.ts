import { Vector } from './vector'
import { Shape } from '../geometry/shape'

export class SetSpace {
  public readonly objects: Uint8Array

  public constructor(public readonly width: number) {
    this.objects = new Uint8Array(width * width)
  }

  public has(pos: Vector): boolean {
    return this.objects[pos.index(this.width)] > 0
  }

  public set(pos: Vector): void {
    this.objects[pos.index(this.width)] = 1
  }

  public byIndex(index: number): number {
    return this.objects[index]
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

  public clear(): void {
    this.objects.fill(0)
  }

  public add(space: SetSpace) {
    for (let index = 0; index < this.width * this.width; ++index) {
      if (space.byIndex(index) > 0) {
        this.objects[index] = 1
      }
    }
  }
}
