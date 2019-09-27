import { Color } from '../renderer/color'
import { TlbWorld } from '../tlb'

import { FeatureComponent } from './feature'
import { PositionComponent } from './position'
import { WorldMap } from '../resources/world-map'
import { Vector } from '../spatial'
import { Entity } from '../ecs/entity'
import { FeatureType, features } from '../assets/features'

export type FeatureProvider = () => Feature

export interface FeatureComponent {
  feature: FeatureProvider
}

export interface Feature {
  character: string
  diffuse: Color

  blocking: boolean
  lightBlocking: boolean
  name: string
}

export function getFeature(world: TlbWorld, entity: Entity): Feature | undefined {
  const feature = world.getComponent<FeatureComponent>(entity, 'feature')
  if (feature) {
    return feature.feature()
  }
  return undefined
}

export function createFeatureFromType(world: TlbWorld, map: WorldMap, level: number, position: Vector, type: FeatureType): Entity {
  return createFeature(world, map, level, position, () => features[type])
}

export function createFeature(world: TlbWorld, map: WorldMap, level: number, position: Vector, feature: FeatureProvider): Entity {
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
