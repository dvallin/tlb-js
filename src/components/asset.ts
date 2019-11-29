import { Vector } from '../spatial'
import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { WorldMap, WorldMapResource } from '../resources/world-map'
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
import { DialogType } from '../assets/dialogs'
import { DialogComponent } from './dialog'

export interface AssetComponent {
  type: AssetType
}

export interface Asset {
  name: string
  size: Vector
  hasInventory: boolean
  dialog: DialogType | undefined
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

export function createAsset(world: TlbWorld, level: number, position: Vector, direction: Direction, type: AssetType): Entity {
  const shape = shapeOfAsset(type, position, direction)
  return createAssetFromShape(world, level, shape, type)
}

export function createAssetFromShape(world: TlbWorld, level: number, shape: Shape, type: AssetType): Entity {
  const entity = placeAsset(world, type)
  placeAssetParts(world, type, entity, level, shape)
  return entity
}

function placeAsset(world: TlbWorld, type: AssetType): Entity {
  const asset = assets[type]
  const entity = world
    .createEntity()
    .withComponent<AssetComponent>('asset', { type })
    .withComponent<TriggersComponent>('triggers', { name: asset.name, type: 'asset', entities: [] }).entity
  if (asset.hasInventory) {
    world.editEntity(entity).withComponent<InventoryComponent>('inventory', { content: [] })
  }
  if (asset.dialog !== undefined) {
    world.editEntity(entity).withComponent<DialogComponent>('dialog', { type: asset.dialog })
  }
  return entity
}

function placeAssetParts(world: TlbWorld, type: AssetType, entity: Entity, level: number, shape: Shape): void {
  const map: WorldMap = world.getResource<WorldMapResource>('map')
  const asset = assets[type]
  shape.foreach((p, i) => {
    const tile = putTile(world, map, level, p, () => asset.feature(i))
    addTrigger(world, tile, entity)
  })
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
  createFeature(world, position.level, position.position, ground.feature)
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
