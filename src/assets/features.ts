import { Feature } from '../components/feature'
import { gray, primary } from '../renderer/palettes'
import { strangeSymbols, gridSymbols, arrows } from '../symbols'
import { Color } from '../renderer/color'

function character(character: string, name: string, diffuse: Color): Feature {
  return {
    cover: 'none',
    blocking: true,
    lightBlocking: true,
    ground: false,

    character,
    diffuse,
    name,
  }
}

function ground(name: string, character: string, diffuse: Color): Feature {
  return {
    cover: 'none',
    blocking: false,
    lightBlocking: false,
    ground: true,

    character,
    diffuse,
    name,
  }
}

function highObstacle(name: string, character: string, diffuse: Color): Feature {
  return {
    cover: 'full',
    blocking: true,
    lightBlocking: true,
    ground: false,

    character,
    diffuse,
    name,
  }
}

function lowObstacle(name: string, character: string, diffuse: Color): Feature {
  return {
    cover: 'partial',
    blocking: true,
    lightBlocking: false,
    ground: false,

    character,
    diffuse,
    name,
  }
}

function decoration(name: string, character: string, diffuse: Color): Feature {
  return {
    cover: 'none',
    blocking: false,
    lightBlocking: false,
    ground: false,

    character,
    diffuse,
    name,
  }
}

const featuresDefinition = {
  wall: highObstacle('wall', '#', gray[3]),
  corridor: ground('corridor', '.', gray[0]),
  room: ground('floor', '.', primary[1]),
  hub: ground('floor', '.', primary[0]),
  locker: highObstacle('locker', strangeSymbols[16], primary[1]),
  trash: decoration('trash', strangeSymbols[21], gray[2]),
  door: highObstacle('door', strangeSymbols[27], primary[1]),
  player: character('@', 'you', primary[0]),
  loot: decoration('some loot', 'l', primary[1]),
  table: lowObstacle('a table', strangeSymbols[3], primary[1]),
  civilian: character('c', 'civilian', primary[1]),
  guard: character('g', 'guard', primary[1]),
  eliteGuard: character('g', 'elite guard', primary[3]),
  terminal: lowObstacle('a terminal', strangeSymbols[28], primary[1]),
}
export type FeatureType = keyof typeof featuresDefinition
export const features: { [key in FeatureType]: Feature } = featuresDefinition

const generatorsDefinition: { [key: string]: (index: number) => Feature } = {
  block: (index: number) => highObstacle('a block of concrete', gridSymbols[[7, 5, 15, 17][index]], primary[1]),
  elevator: (_index: number) => lowObstacle('an elevator', arrows[7], primary[1]),
}
export type FeatureGeneratorsType = keyof typeof generatorsDefinition
export const generators: { [key in FeatureGeneratorsType]: (index: number) => Feature } = generatorsDefinition
