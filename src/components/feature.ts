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
  description: string
}

export const features = {
  wall: {
    character: '#',
    diffuse: gray[3],
    blocking: true,
    lightBlocking: true,
    description: 'a wall',
  },
  corridor: {
    character: '.',
    diffuse: gray[0],
    blocking: false,
    lightBlocking: false,
    description: 'a corridor',
  },
  room: {
    character: '.',
    diffuse: primary[1],
    blocking: false,
    lightBlocking: false,
    description: 'floor of a room',
  },
  locker: {
    character: strangeSymbols[16],
    diffuse: primary[1],
    blocking: true,
    lightBlocking: true,
    description: 'a locker',
  },
  trash: {
    character: strangeSymbols[21],
    diffuse: gray[2],
    blocking: false,
    lightBlocking: false,
    description: 'some trash',
  },
  door: {
    character: strangeSymbols[27],
    diffuse: primary[1],
    blocking: true,
    lightBlocking: true,
    description: 'a door',
  },
  hub: {
    character: '.',
    diffuse: primary[0],
    blocking: false,
    lightBlocking: false,
    description: 'floor of a hub',
  },
  player: {
    character: '@',
    diffuse: primary[0],
    blocking: true,
    lightBlocking: true,
    description: 'you',
  },
  guard: enemy('g', 'a guard'),
  eliteGuard: eliteEnemy('g', 'a very strong guard'),
}

function enemy(character: string, description: string): Feature {
  return {
    character,
    diffuse: primary[1],
    blocking: true,
    lightBlocking: true,
    description,
  }
}

function eliteEnemy(character: string, description: string): Feature {
  return {
    character,
    diffuse: primary[3],
    blocking: true,
    lightBlocking: true,
    description,
  }
}

export function getFeature(world: TlbWorld, entity: number): Feature | undefined {
  const feature = world.getComponent<FeatureComponent>(entity, 'feature')
  if (feature) {
    return features[feature.type]
  }
  return undefined
}

export function createFeature(world: TlbWorld, map: WorldMap, position: Vector, type: FeatureType): Entity {
  const e = map.getTile(position)
  if (e !== undefined) {
    throw new Error(`there is already a tile at ${position.key}`)
  }

  const entity = world
    .createEntity()
    .withComponent<PositionComponent>('position', { position })
    .withComponent<FeatureComponent>('feature', { type }).entity
  map.setTile(position, entity)
  return entity
}
