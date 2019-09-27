import { StructureDescription, Spawn } from './complex-embedder'
import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { StructureComponent } from '../components/region'
import { AssetType } from '../assets/assets'
import { Random } from '../random'
import { directions, oppositeOf } from '../spatial/direction'
import { Vector } from '../spatial'
import { retry } from './retry'
import { shapeOfAsset, createAssetFromShape } from '../components/asset'
import { WorldMap } from '../resources/world-map'
import { features } from '../assets/features'

export function fill(world: TlbWorld, map: WorldMap, level: number, entity: Entity, random: Random, description: StructureDescription) {
  const structure = world.getComponent<StructureComponent>(entity, 'structure')!

  const sampledAssets: AssetType[] = []
  description.containers.forEach(c => sampledAssets.push(...sampleSpawn(random, c)))
  description.decorations.forEach(d => sampledAssets.push(...sampleSpawn(random, d)))
  // place all at border for now
  retry(random, sampledAssets, a => {
    const direction = random.pick(directions)
    const directionIntoRoom = oppositeOf(direction)
    const bounds = structure.shape.bounds()
    const center = bounds.centerOf(direction)
    const h = Math.floor(bounds.height / 2)
    const offset = Vector.fromDirection(direction)
      .perpendicular()
      .mult(random.integerBetween(-h, h))
    const p = center.add(offset)
    const shape = shapeOfAsset(a, p, directionIntoRoom)
    const shapeInsideWall = shape.translate(Vector.fromDirection(direction))
    const isFree = shape.all(p =>
      map.levels[level].tileMatches(world, p, t => t !== undefined && (t.feature() === features.room || t.feature() === features.corridor))
    )
    const isBackedByWall = shapeInsideWall.all(p =>
      map.levels[level].tileMatches(world, p, t => t === undefined || t.feature() === features.wall)
    )
    if (isFree && isBackedByWall) {
      createAssetFromShape(world, map, level, shape, a)
    }
    return isFree
  })
}

function sampleSpawn<S>(random: Random, spawn: Spawn<S>): S[] {
  const amount = random.integerBetween(spawn.occurrence.minimum, spawn.occurrence.maximum)
  const result: S[] = []
  for (let i = 0; i < amount; i++) {
    result.push(random.pick(spawn.types))
  }
  return result
}
