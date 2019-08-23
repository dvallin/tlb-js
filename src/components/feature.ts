import { Color } from '../renderer/color'
import { gray, primary } from '../renderer/palettes'
import { TlbWorld } from '../tlb'

import { FeatureComponent } from './feature'
import { PositionComponent } from './position'
import { WorldMap } from '../resources/world-map'
import { Vector } from '../spatial'
import { Entity } from '../ecs/entity'
import { strangeSymbols } from '../symbols'

export type FeatureType = keyof typeof features
export interface FeatureComponent {
  type: FeatureType
}

export interface Feature {
  character: string
  diffuse: Color

  blocking: boolean
  lightBlocking: boolean
  name: string
}

export const features = {
  wall: {
    character: '#',
    diffuse: gray[3],
    blocking: true,
    lightBlocking: true,
    name: 'wall',
  },
  corridor: {
    character: '.',
    diffuse: gray[0],
    blocking: false,
    lightBlocking: false,
    name: 'corridor',
  },
  room: {
    character: '.',
    diffuse: primary[1],
    blocking: false,
    lightBlocking: false,
    name: 'floor',
  },
  locker: {
    character: strangeSymbols[16],
    diffuse: primary[1],
    blocking: true,
    lightBlocking: true,
    name: 'locker',
  },
  trash: {
    character: strangeSymbols[21],
    diffuse: gray[2],
    blocking: false,
    lightBlocking: false,
    name: 'trash',
  },
  door: {
    character: strangeSymbols[27],
    diffuse: primary[1],
    blocking: true,
    lightBlocking: true,
    name: 'door',
  },
  hub: {
    character: '.',
    diffuse: primary[0],
    blocking: false,
    lightBlocking: false,
    name: 'floor',
  },
  player: {
    character: '@',
    diffuse: primary[0],
    blocking: true,
    lightBlocking: true,
    name: 'you',
  },
  loot: {
    character: 'l',
    diffuse: primary[1],
    blocking: false,
    lightBlocking: false,
    name: 'some loot',
  },
  guard: enemy('g', 'guard'),
  eliteGuard: eliteEnemy('g', 'elite guard'),
}
export const featureTypeguard: { [key: string]: Feature } = features

function enemy(character: string, name: string): Feature {
  return {
    character,
    diffuse: primary[1],
    blocking: true,
    lightBlocking: true,
    name,
  }
}

function eliteEnemy(character: string, name: string): Feature {
  return {
    character,
    diffuse: primary[3],
    blocking: true,
    lightBlocking: true,
    name,
  }
}

export function getFeature(world: TlbWorld, entity: Entity): Feature | undefined {
  const feature = world.getComponent<FeatureComponent>(entity, 'feature')
  if (feature) {
    return features[feature.type]
  }
  return undefined
}

export function createFeature(world: TlbWorld, map: WorldMap, level: number, position: Vector, type: FeatureType): Entity {
  const e = map.levels[level].getTile(position)
  if (e !== undefined) {
    throw new Error(`there is already a tile at ${position.key}`)
  }

  const entity = world
    .createEntity()
    .withComponent<PositionComponent>('position', { level, position })
    .withComponent<FeatureComponent>('feature', { type }).entity
  map.levels[level].setTile(position, entity)
  return entity
}
