import { Shape } from '../geometry/shape'
import { Rectangle } from '../geometry/rectangle'

import { Vector } from '../spatial'
import { Union } from '../geometry/union'
import { Asset } from '../components/asset'
import { EntrySlot, AssetSlot } from './common'

export interface Room {
  shape: Shape
  entries: Shape[]
  assets: Asset[]

  availableEntries: EntrySlot[]
  availableAssets: AssetSlot[]
}

export const rectangular: Room = {
  shape: new Rectangle(0, 0, 7, 7),
  entries: [],
  assets: [],
  availableEntries: [
    { position: new Vector([3, -1]), direction: 'down', width: 3 },
    { position: new Vector([-1, 3]), direction: 'right', width: 3 },
    { position: new Vector([7, 3]), direction: 'left', width: 3 },
    { position: new Vector([4, 7]), direction: 'up', width: 3 },
  ],
  availableAssets: [],
}

export const largeRectangular: Room = {
  shape: new Rectangle(0, 0, 14, 14),
  entries: [],
  assets: [],
  availableEntries: [
    { position: new Vector([3, -1]), direction: 'down', width: 3 },
    { position: new Vector([7, -1]), direction: 'down', width: 3 },
    { position: new Vector([11, -1]), direction: 'down', width: 3 },
    { position: new Vector([-1, 3]), direction: 'right', width: 3 },
    { position: new Vector([14, 3]), direction: 'left', width: 3 },
    { position: new Vector([-1, 7]), direction: 'right', width: 3 },
    { position: new Vector([14, 7]), direction: 'left', width: 3 },
    { position: new Vector([-1, 11]), direction: 'right', width: 3 },
    { position: new Vector([14, 11]), direction: 'left', width: 3 },
    { position: new Vector([3, 14]), direction: 'up', width: 3 },
    { position: new Vector([7, 14]), direction: 'up', width: 3 },
    { position: new Vector([11, 14]), direction: 'up', width: 3 },
  ],
  availableAssets: [],
}

export const lShaped: Room = {
  shape: new Union(new Rectangle(0, 0, 14, 7), new Rectangle(0, 7, 7, 7)),
  entries: [],
  assets: [],
  availableEntries: [
    { position: new Vector([3, -1]), direction: 'down', width: 3 },
    { position: new Vector([7, -1]), direction: 'down', width: 3 },
    { position: new Vector([11, -1]), direction: 'down', width: 3 },
    { position: new Vector([-1, 3]), direction: 'right', width: 3 },
    { position: new Vector([14, 3]), direction: 'left', width: 3 },
    { position: new Vector([-1, 7]), direction: 'right', width: 3 },
    { position: new Vector([11, 7]), direction: 'up', width: 3 },
    { position: new Vector([-1, 11]), direction: 'right', width: 3 },
    { position: new Vector([7, 6]), direction: 'left', width: 3 },
    { position: new Vector([3, 14]), direction: 'up', width: 3 },
  ],
  availableAssets: [{ position: new Vector([0, 0]) }, { position: new Vector([5, 5]) }, { position: new Vector([7, 4]) }],
}
