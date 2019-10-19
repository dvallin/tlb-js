import { Vector } from '../spatial'
import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { WorldMap } from '../resources/world-map'
import { Shape } from '../geometry/shape'

import { FeatureComponent, createFeature, Feature, FeatureProvider } from './feature'
import { GroundComponent } from './ground'
import { PositionComponent } from './position'
import { Rectangle } from '../geometry/rectangle'
import { TriggersComponent } from './trigger'

import { AssetType, assets } from '../assets/assets'
import { FeatureType } from '../assets/features'
import { Direction } from '../spatial/direction'
import { InventoryComponent } from './items'

export interface AssetComponent {
  type: AssetType
}

export type Cover = 'full' | 'partial' | 'none'
export interface Asset {
  name: string
  size: Vector
  cover: Cover
  hasInventory: boolean
  feature: (index: number) => Feature
}

export interface PlacedAsset {
  type: AssetType
  tiles: { position: Vector; feature: FeatureType }[]
}

export function shapeOfAsset(type: AssetType, position: Vector, direction: Direction): Shape {
  const asset = assets[type]
  return Rectangle.footprint(position, direction, asset.size)
}

export function createAsset(
  world: TlbWorld,
  map: WorldMap,
  level: number,
  position: Vector,
  direction: Direction,
  type: AssetType
): Entity {
  const asset = assets[type]
  const entity = world
    .createEntity()
    .withComponent<AssetComponent>('asset', { type })
    .withComponent<TriggersComponent>('triggers', { name: asset.name, entities: [] }).entity
  if (asset.hasInventory) {
    world.editEntity(entity).withComponent<InventoryComponent>('inventory', { content: [] })
  }
  shapeOfAsset(type, position, direction).foreach((p, i) => {
    const tile = putTile(world, map, level, p, () => asset.feature(i))
    addTrigger(world, tile, entity)
  })
  return entity
}

export function createAssetFromShape(world: TlbWorld, map: WorldMap, level: number, shape: Shape, type: AssetType): Entity {
  const asset = assets[type]
  const entity = world
    .createEntity()
    .withComponent<AssetComponent>('asset', { type })
    .withComponent<TriggersComponent>('triggers', { name: asset.name, entities: [] }).entity
  if (asset.hasInventory) {
    world.editEntity(entity).withComponent<InventoryComponent>('inventory', { content: [] })
  }
  shape.foreach((p, i) => {
    const tile = putTile(world, map, level, p, () => asset.feature(i))
    addTrigger(world, tile, entity)
  })
  return entity
}

export function removeAsset(world: TlbWorld, map: WorldMap, entity: Entity): void {
  const triggers = world.getComponent<TriggersComponent>(entity, 'triggers')!
  triggers.entities.forEach(tile => removeTile(world, map, tile))
  world.deleteEntity(entity)
}

function removeTile(world: TlbWorld, map: WorldMap, entity: Entity): void {
  const ground = world.getComponent<GroundComponent>(entity, 'ground')!
  const position = world.getComponent<PositionComponent>(entity, 'position')!
  map.levels[position.level].removeTile(position.position)
  createFeature(world, map, position.level, position.position, ground.feature)
  world.deleteEntity(entity)
}

function putTile(world: TlbWorld, map: WorldMap, level: number, position: Vector, feature: FeatureProvider): Entity {
  const ground = removeGround(world, map, level, position)
  const tile = world
    .createEntity()
    .withComponent<PositionComponent>('position', { level, position })
    .withComponent<FeatureComponent>('feature', { feature })
    .withComponent<GroundComponent>('ground', { feature: ground }).entity
  map.levels[level].setTile(position, tile)
  return tile
}

function addTrigger(world: TlbWorld, tile: Entity, entity: Entity): void {
  world.editEntity(tile).withComponent('triggered-by', { entity })
  world.getComponent<TriggersComponent>(entity, 'triggers')!.entities.push(tile)
}

function removeGround(world: TlbWorld, map: WorldMap, level: number, position: Vector): FeatureProvider {
  const entity = map.levels[level].removeTile(position)
  if (entity === undefined) {
    throw new Error(`cannot build asset on missing ground at ${position.key}`)
  }
  const feature = world.getComponent<FeatureComponent>(entity, 'feature')
  if (feature === undefined || feature.feature().blocking) {
    throw new Error('cannot build asset on missing or blocking ground')
  }
  world.deleteEntity(entity)
  return feature.feature
}
