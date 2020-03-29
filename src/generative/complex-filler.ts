import { StructureDescription, Spawn, CharacterCreator, Placement } from './complex-embedder'
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
import { ItemType } from '../assets/items'
import { ItemComponent, InventoryComponent } from '../components/items'
import { Rectangle } from '../geometry/rectangle'
import { placeCharacter } from '../component-reducers/place-character'

type AssetPlacements = { [key in Placement]: AssetType[] }
export function fill(world: TlbWorld, map: WorldMap, level: number, entity: Entity, random: Random, description: StructureDescription) {
  const structure = world.getComponent<StructureComponent>(entity, 'structure')!

  const sampledContainers: AssetPlacements = { center: [], wall: [], random: [] }
  description.containers.forEach(c => {
    sampledContainers[c.placement].push(...sampleSpawn(random, c))
  })
  const containers: Entity[] = placeAssets(world, map, level, random, sampledContainers, structure.shape.bounds())

  const sampledDecorations: AssetPlacements = { center: [], wall: [], random: [] }
  description.decorations.forEach(c => {
    sampledDecorations[c.placement].push(...sampleSpawn(random, c))
  })
  placeAssets(world, map, level, random, sampledDecorations, structure.shape.bounds())

  const sampledItems: ItemType[] = []
  description.loots.forEach(l => sampledItems.push(...sampleSpawn(random, l)))

  const sampledCharacters: CharacterCreator[] = []
  description.npcs.forEach(l => sampledCharacters.push(...sampleSpawn(random, l)))
  placeCharacterRandomly(world, map, level, random, sampledCharacters, structure.shape.bounds())

  if (containers.length > 0) {
    const items: Entity[] = sampledItems.map(
      i =>
        world.createEntity().withComponent<ItemComponent>('item', { type: i }).entity
    )
    items.forEach(item => {
      const container = random.pick(containers)
      world.getComponent<InventoryComponent>(container, 'inventory')!.content.push(item)
    })
  }
}

function sampleSpawn<S>(random: Random, spawn: Spawn<S>): S[] {
  const amount = random.integerBetween(spawn.occurrence.minimum, spawn.occurrence.maximum)
  const result: S[] = []
  for (let i = 0; i < amount; i++) {
    result.push(random.pick(spawn.types))
  }
  return result
}

function placeAssets(
  world: TlbWorld,
  map: WorldMap,
  level: number,
  random: Random,
  placements: AssetPlacements,
  bounds: Rectangle
): Entity[] {
  return [
    ...placeAssetAtWalls(world, map, level, random, placements.wall, bounds),
    ...placeAssetRandomly(world, map, level, random, placements.random, bounds),
    ...placeAssetCentered(world, map, level, random, placements.center, bounds),
  ]
}

function placeAssetAtWalls(
  world: TlbWorld,
  map: WorldMap,
  level: number,
  random: Random,
  assets: AssetType[],
  bounds: Rectangle
): Entity[] {
  const placedAssets: Entity[] = []
  retry(random, assets, a => {
    const direction = random.pick(directions)
    const directionIntoRoom = oppositeOf(direction)
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
      placedAssets.push(createAssetFromShape(world, random, level, shape, a))
    }
    return isFree
  })
  return placedAssets
}

function placeAssetRandomly(
  world: TlbWorld,
  map: WorldMap,
  level: number,
  random: Random,
  assets: AssetType[],
  bounds: Rectangle
): Entity[] {
  const placedAssets: Entity[] = []
  retry(random, assets, a => {
    const direction = random.pick(directions)
    const position = new Vector([random.integerBetween(bounds.left, bounds.right), random.integerBetween(bounds.top, bounds.bottom)])
    const shape = shapeOfAsset(a, position, direction)
    const isFree = shape.all(p => canPlace(world, map, level, p))
    if (isFree) {
      placedAssets.push(createAssetFromShape(world, random, level, shape, a))
    }
    return isFree
  })
  return placedAssets
}

function placeAssetCentered(
  world: TlbWorld,
  map: WorldMap,
  level: number,
  random: Random,
  assets: AssetType[],
  bounds: Rectangle
): Entity[] {
  const placedAssets: Entity[] = []
  retry(random, assets, a => {
    const direction = random.pick(directions)
    const position = bounds.center
    const shape = shapeOfAsset(a, position, direction)
    const isFree = shape.all(p => canPlace(world, map, level, p))
    if (isFree) {
      placedAssets.push(createAssetFromShape(world, random, level, shape, a))
    }
    return isFree
  })
  return placedAssets
}

function placeCharacterRandomly(
  world: TlbWorld,
  map: WorldMap,
  level: number,
  random: Random,
  characters: CharacterCreator[],
  bounds: Rectangle
): Entity[] {
  const placedCharacters: Entity[] = []
  retry(random, characters, creator => {
    const position = new Vector([random.integerBetween(bounds.left, bounds.right), random.integerBetween(bounds.top, bounds.bottom)])
    const isFree = canPlace(world, map, level, position)
    if (isFree) {
      const character = creator(world)
      placeCharacter(world, character, level, position)
      placedCharacters.push(character)
    }
    return isFree
  })
  return placedCharacters
}

function canPlace(world: TlbWorld, map: WorldMap, level: number, position: Vector): boolean {
  return map.levels[level].tileMatches(world, position, t => t !== undefined && t.feature().ground)
}
