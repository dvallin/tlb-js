import { Feature } from '../components/feature'
import { gray, primary } from '../renderer/palettes'
import { strangeSymbols, gridSymbols, arrows } from '../symbols'

function enemy(character: string, name: string): Feature {
  return {
    character,
    diffuse: primary[1],
    blocking: true,
    lightBlocking: true,
    ground: false,
    name,
  }
}

function eliteEnemy(character: string, name: string): Feature {
  return {
    character,
    diffuse: primary[3],
    blocking: true,
    lightBlocking: true,
    ground: false,
    name,
  }
}

const featuresDefinition = {
  wall: {
    character: '#',
    diffuse: gray[3],
    blocking: true,
    lightBlocking: true,
    ground: false,
    name: 'wall',
  },
  corridor: {
    character: '.',
    diffuse: gray[0],
    blocking: false,
    lightBlocking: false,
    ground: true,
    name: 'corridor',
  },
  room: {
    character: '.',
    diffuse: primary[1],
    blocking: false,
    lightBlocking: false,
    ground: true,
    name: 'floor',
  },
  locker: {
    character: strangeSymbols[16],
    diffuse: primary[1],
    blocking: true,
    lightBlocking: true,
    ground: false,
    name: 'locker',
  },
  trash: {
    character: strangeSymbols[21],
    diffuse: gray[2],
    blocking: false,
    lightBlocking: false,
    ground: false,
    name: 'trash',
  },
  door: {
    character: strangeSymbols[27],
    diffuse: primary[1],
    blocking: true,
    lightBlocking: true,
    ground: false,
    name: 'door',
  },
  hub: {
    character: '.',
    diffuse: primary[0],
    blocking: false,
    lightBlocking: false,
    ground: true,
    name: 'floor',
  },
  player: {
    character: '@',
    diffuse: primary[0],
    blocking: true,
    lightBlocking: true,
    ground: false,
    name: 'you',
  },
  loot: {
    character: 'l',
    diffuse: primary[1],
    blocking: false,
    lightBlocking: false,
    ground: false,
    name: 'some loot',
  },
  table: {
    character: strangeSymbols[3],
    diffuse: primary[1],
    blocking: true,
    lightBlocking: false,
    ground: false,
    name: 'a table',
  },
  guard: enemy('g', 'guard'),
  eliteGuard: eliteEnemy('g', 'elite guard'),
}
export type FeatureType = keyof typeof featuresDefinition
export const features: { [key in FeatureType]: Feature } = featuresDefinition

const generatorsDefinition = {
  block: (index: number) => ({
    character: gridSymbols[[7, 5, 15, 17][index]],
    diffuse: primary[1],
    blocking: true,
    lightBlocking: false,
    ground: false,
    name: 'a block of concrete',
  }),
  elevator: (_index: number) => ({
    character: arrows[7],
    diffuse: primary[1],
    blocking: true,
    lightBlocking: false,
    ground: false,
    name: 'an elevator',
  }),
}
export type FeatureGeneratorsType = keyof typeof generatorsDefinition
export const generators: { [key in FeatureGeneratorsType]: (index: number) => Feature } = generatorsDefinition
