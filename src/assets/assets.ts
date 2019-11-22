import { Asset, Cover } from '../components/asset'
import { Vector } from '../spatial'
import { features, generators } from './features'
import { Feature } from '../components/feature'
import { DialogType } from './dialogs'

const s1x1 = new Vector([1, 1])
const s1x2 = new Vector([1, 2])
const s3x1 = new Vector([3, 1])
const s2x2 = new Vector([2, 2])
function asset(name: string, size: Vector, cover: Cover, dialog: DialogType | undefined, feature: (index: number) => Feature): Asset {
  return { name, size, cover, hasInventory: true, dialog, feature }
}

const assetsDefinition = {
  door: asset('metal door', s3x1, 'full', undefined, () => features['door']),
  locker: asset('a locker', s1x1, 'full', undefined, () => features['locker']),
  trash: asset('some trash', s1x1, 'none', undefined, () => features['trash']),
  loot: asset('a dead body', s1x1, 'none', undefined, () => features['loot']),
  table: asset('a table', s1x2, 'partial', undefined, () => features['table']),
  generator: asset('a generator', s2x2, 'full', undefined, generators['block']),
  elevator: asset('an elevator', s1x1, 'none', 'elevator', generators['elevator']),
}

export type AssetType = keyof typeof assetsDefinition
export const assets: { [key in AssetType]: Asset } = assetsDefinition
