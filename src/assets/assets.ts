import { Asset, Cover } from '../components/asset'
import { Vector } from '../spatial'
import { features, generators } from './features'
import { Feature } from '../components/feature'

const s1x1 = new Vector([1, 1])
const s1x2 = new Vector([1, 1])
const s3x1 = new Vector([3, 1])
const s2x2 = new Vector([2, 2])
function asset(name: string, size: Vector, cover: Cover, feature: (index: number) => Feature): Asset {
  return { name, size, cover, hasInventory: true, feature }
}

const assetsDefinition = {
  door: asset('metal door', s3x1, 'full', () => features['door']),
  locker: asset('a locker', s1x1, 'full', () => features['locker']),
  trash: asset('some trash', s1x1, 'none', () => features['trash']),
  loot: asset('a dead body', s1x1, 'none', () => features['loot']),
  table: asset('a table', s1x2, 'partial', () => features['table']),
  generator: asset('a generator', s2x2, 'full', generators['block']),
}

export type AssetType = keyof typeof assetsDefinition
export const assets: { [key in AssetType]: Asset } = assetsDefinition
