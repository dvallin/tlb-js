import { Color } from '../renderer/color'
import { TlbWorld } from '../tlb'

import { PositionComponent } from './position'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { Vector } from '../spatial'
import { Entity } from '../ecs/entity'
import { FeatureType, features } from '../assets/features'

export type FeatureProvider = () => Feature

export interface FeatureComponent {
  feature: FeatureProvider
}

export type Cover = 'full' | 'partial' | 'none'
export interface Feature {
  character: string
  diffuse: Color

  cover: Cover
  blocking: boolean
  lightBlocking: boolean
  ground: boolean
  name: string
}

export function getFeature(world: TlbWorld, entity: Entity): Feature | undefined {
  const feature = world.getComponent<FeatureComponent>(entity, 'feature')
  if (feature) {
    return feature.feature()
  }
  return undefined
}

export function createFeatureFromType(world: TlbWorld, level: number, position: Vector, type: FeatureType): Entity {
  return createFeature(world, level, position, () => features[type])
}

export function createFeature(world: TlbWorld, level: number, position: Vector, feature: FeatureProvider): Entity {
  const map: WorldMap = world.getResource<WorldMapResource>('map')
  const e = map.levels[level].getTile(position)
  if (e !== undefined) {
    throw new Error(`there is already a tile at ${position.key}`)
  }

  const entity = world
    .createEntity()
    .withComponent<PositionComponent>('position', { level, position })
    .withComponent<FeatureComponent>('feature', { feature }).entity
  map.levels[level].setTile(position, entity)
  return entity
}
