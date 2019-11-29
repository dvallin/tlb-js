import { Asset } from '../components/asset'
import { Vector } from '../spatial'
import { features, generators } from './features'
import { Feature } from '../components/feature'
import { DialogType } from './dialogs'

const s1x1 = new Vector([1, 1])
const s1x2 = new Vector([1, 2])
const s3x1 = new Vector([3, 1])
const s2x2 = new Vector([2, 2])
function asset(name: string, size: Vector, dialog: DialogType | undefined, feature: (index: number) => Feature): Asset {
  return { name, size, hasInventory: true, dialog, feature }
}

const assetsDefinition = {
  door: asset('metal door', s3x1, undefined, () => features['door']),
  locker: asset('a locker', s1x1, undefined, () => features['locker']),
  trash: asset('some trash', s1x1, undefined, () => features['trash']),
  loot: asset('a dead body', s1x1, undefined, () => features['loot']),
  table: asset('a table', s1x2, undefined, () => features['table']),
  generator: asset('a generator', s2x2, undefined, generators['block']),
  elevator: asset('an elevator', s1x1, 'elevator', generators['elevator']),
}

export type AssetType = keyof typeof assetsDefinition
export const assets: { [key in AssetType]: Asset } = assetsDefinition
