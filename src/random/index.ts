import { Distribution } from './distributions'
import { Rectangle } from '../geometry/rectangle'
import { Vector } from '../spatial'

export class Random {
  public constructor(public readonly distribution: Distribution) {}

  public floatBetween(minInclusive: number, maxExclusive: number): number {
    return this.distribution.sample() * (maxExclusive - minInclusive) + minInclusive
  }

  public integerBetween(minInclusive: number, maxInclusive: number): number {
    const c = this.distribution.sample()
    return Math.floor(c * (maxInclusive - minInclusive + 1)) + minInclusive
  }

  public decision(probability: number): boolean {
    return this.distribution.sample() < probability
  }

  public weightedDecision(weights: number[]): number {
    const sum = weights.reduce((v, c) => v + c, 0)
    const pick = this.integerBetween(0, sum - 1)
    let agg = 0
    for (let i = 0; i < weights.length; i++) {
      agg += weights[i]
      if (pick < agg) {
        return i
      }
    }
    throw new Error('invalid input to weighted decision')
  }

  public pick<T>(array: T[]): T {
    return array[this.integerBetween(0, array.length - 1)]
  }

  public pickIndex<T>(array: T[]): number {
    return this.integerBetween(0, array.length - 1)
  }

  public shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = this.integerBetween(0, i)
      const t = array[i]
      array[i] = array[j]
      array[j] = t
    }
  }

  public insideRectangle(rectangle: Rectangle): Vector {
    return new Vector([this.integerBetween(rectangle.left, rectangle.right), this.integerBetween(rectangle.top, rectangle.bottom)])
  }
}
