import { TlbWorld } from '../tlb'
import { FunctionalShape } from '../geometry/functional-shape'
import { Vector } from '../spatial'
import { Line } from '../spatial/line'
import { WorldMapResource } from '../resources/world-map'
import { FeatureComponent, Cover } from '../components/feature'

export function coveringPositions(from: Vector, to: Vector): Vector[] {
  const result: Vector[] = []
  const flankingLine = new Line(to, to.minus(from).perpendicular())
  const attackFromSide = flankingLine.side(from)
  FunctionalShape.lN(to, 1, false).foreach(p => {
    const defendsSide = flankingLine.side(p)
    if (defendsSide === attackFromSide) {
      result.push(p)
    }
  })
  return result
}

export function aggregateCover(world: TlbWorld, level: number, coveringPositions: Vector[]): Cover {
  const map = world.getResource<WorldMapResource>('map').levels[level]
  let worstCover: Cover = 'full'
  coveringPositions.forEach(p => {
    const tile = map.getTile(p)
    if (tile !== undefined) {
      const feature = world.getComponent<FeatureComponent>(tile, 'feature')!
      const cover = feature.feature().cover
      console.log(cover, worstCover)
      switch (worstCover) {
        case 'full':
          worstCover = cover
          break
        case 'partial':
          if (cover !== 'full') {
            worstCover = cover
          }
      }
    }
  })
  return worstCover
}
