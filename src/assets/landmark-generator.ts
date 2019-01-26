import { Random } from '../random'
import { hub } from './landmarks'
import { Landmark } from './landmarks'
import { Vector } from 'src/spatial'

export class LandmarkGenerator {
  public constructor(public readonly random: Random) {}

  public generate(centerAt: Vector): Landmark {
    const landmark = this.random.pick([hub])
    const bounding = landmark.shape.bounds()
    const translation = centerAt.minus(bounding.center)
    return {
      entries: landmark.entries.map(e => ({
        direction: e.direction,
        position: e.position.add(translation),
        width: 3,
      })),
      assets: landmark.assets.map(a => ({
        position: a.position.add(translation),
      })),
      shape: landmark.shape.translate(translation),
    }
  }
}
