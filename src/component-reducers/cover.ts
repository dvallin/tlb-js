import { TlbWorld } from '../tlb'
import { Vector } from '../spatial'
import { WorldMapResource } from '../resources/world-map'
import { FeatureComponent, Cover } from '../components/feature'
import { directions } from '../spatial/direction'

export function coveringPositions(from: Vector, to: Vector): Vector[] {
  let cover: Vector[] = []
  let closest: number = Number.MAX_VALUE
  const fromFloor = new Vector([from.fX, from.fY])
  const toFloor = new Vector([to.fX, to.fY])
  directions.forEach(direction => {
    const current = toFloor.add(Vector.fromDirection(direction))
    const distance = fromFloor.minus(current).squaredLength()
    if (closest > distance) {
      closest = distance
      cover = [current]
    } else if (closest === distance) {
      cover.push(current)
    }
  })
  return cover
}

export function calculateCover(world: TlbWorld, level: number, from: Vector, to: Vector): Cover {
  const map = world.getResource<WorldMapResource>('map').levels[level]
  const covers = coveringPositions(from, to)
  let bestCover: Cover = 'none'
  covers.forEach(p => {
    const tile = map.getTile(p)
    if (tile !== undefined) {
      const feature = world.getComponent<FeatureComponent>(tile, 'feature')!
      const currentCover = feature.feature().cover
      if (bestCover === 'none' || (bestCover === 'partial' && currentCover === 'full')) {
        bestCover = currentCover
      }
    }
  })
  return bestCover
}
