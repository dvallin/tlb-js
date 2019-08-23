import { Vector } from '../spatial'
import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { WorldMap } from '../resources/world-map'
import { Shape } from '../geometry/shape'

import { FeatureType, FeatureComponent, features, createFeature } from './feature'
import { GroundComponent } from './ground'
import { PositionComponent } from './position'
import { Rectangle } from '../geometry/rectangle'
import { TriggeredByComponent, TriggersComponent } from './trigger'

export type AssetType = 'door' | 'locker' | 'trash' | 'loot'
export interface AssetComponent {
  type: AssetType
}

export interface Asset {
  size: number | undefined
}

export const assets = {
  door: {},
  locker: { size: 1 },
  trash: { size: 1 },
}

export function createLocker(world: TlbWorld, map: WorldMap, level: number, position: Vector): Entity {
  const entity = createAsset(world, 'locker')
  putTile(world, map, level, position, entity, 'locker')
  return entity
}

export function createTrash(world: TlbWorld, map: WorldMap, level: number, position: Vector): Entity {
  const entity = createAsset(world, 'trash')
  putTile(world, map, level, position, entity, 'trash')
  return entity
}

export function createLoot(world: TlbWorld, map: WorldMap, level: number, position: Vector): Entity {
  const entity = createAsset(world, 'loot')
  putTile(world, map, level, position, entity, 'loot')
  return entity
}

export function createDoor(world: TlbWorld, map: WorldMap, level: number, shape: Shape): Entity {
  const entity = createAsset(world, 'door')
  shape.foreach(position => {
    putTile(world, map, level, position, entity, 'door')
  })
  return entity
}

export function createAssetFromPosition(world: TlbWorld, map: WorldMap, level: number, position: Vector, type: AssetType): Entity {
  switch (type) {
    case 'door':
      return createDoor(world, map, level, new Rectangle(position.x, position.y, 1, 1))
    case 'locker':
      return createLocker(world, map, level, position)
    case 'trash':
      return createTrash(world, map, level, position)
    case 'loot':
      return createLoot(world, map, level, position)
  }
}

export function removeAsset(world: TlbWorld, map: WorldMap, entity: Entity): void {
  const triggers = world.getComponent<TriggersComponent>(entity, 'triggers')!
  triggers.entities.forEach(tile => removeTile(world, map, tile))
  world.deleteEntity(entity)
}

function createAsset(world: TlbWorld, type: AssetType): Entity {
  return world
    .createEntity()
    .withComponent<AssetComponent>('asset', { type })
    .withComponent<TriggersComponent>('triggers', { entities: [] }).entity
}

function removeTile(world: TlbWorld, map: WorldMap, entity: Entity): void {
  const ground = world.getComponent<GroundComponent>(entity, 'ground')!
  const position = world.getComponent<PositionComponent>(entity, 'position')!
  map.levels[position.level].removeTile(position.position.floor())
  createFeature(world, map, position.level, position.position.floor(), ground.feature)
  world.deleteEntity(entity)
}

function putTile(world: TlbWorld, map: WorldMap, level: number, position: Vector, entity: Entity, type: FeatureType): void {
  const feature = removeGround(world, map, level, position)
  const tile = world
    .createEntity()
    .withComponent<TriggeredByComponent>('triggered-by', { entity })
    .withComponent<PositionComponent>('position', { level, position })
    .withComponent<FeatureComponent>('feature', { type })
    .withComponent<GroundComponent>('ground', { feature }).entity
  map.levels[level].setTile(position, tile)
  world.getComponent<TriggersComponent>(entity, 'triggers')!.entities.push(tile)
}

function removeGround(world: TlbWorld, map: WorldMap, level: number, position: Vector): FeatureType {
  const entity = map.levels[level].removeTile(position)
  if (entity === undefined) {
    throw new Error(`cannot build asset on missing ground at ${position.key}`)
  }
  const feature = world.getComponent<FeatureComponent>(entity, 'feature')
  if (feature === undefined || features[feature.type].blocking) {
    throw new Error('cannot build asset on missing or blocking ground')
  }
  world.deleteEntity(entity)
  return feature.type
}
