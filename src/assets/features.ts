import { Feature } from '../components/feature'
import { gray, primary } from '../renderer/palettes'
import { strangeSymbols } from '../symbols'

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

const featuresDefinition = {
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
  table: {
    character: strangeSymbols[3],
    diffuse: primary[1],
    blocking: true,
    lightBlocking: false,
    name: 'a table',
  },
  guard: enemy('g', 'guard'),
  eliteGuard: eliteEnemy('g', 'elite guard'),
}
export type FeatureType = keyof typeof featuresDefinition
export const features: { [key in FeatureType]: Feature } = featuresDefinition

const generatorsDefinition = {
  block: (index: number) => ({
    character: strangeSymbols[[7, 5, 17, 15][index]],
    diffuse: primary[1],
    blocking: true,
    lightBlocking: false,
    name: 'a block of concrete',
  }),
}
export type FeatureGeneratorsType = keyof typeof generatorsDefinition
export const generators: { [key in FeatureGeneratorsType]: (index: number) => Feature } = generatorsDefinition
