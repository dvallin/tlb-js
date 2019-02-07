import { Shape } from '../geometry/shape'
import { Rectangle } from '../geometry/rectangle'
import { EntrySlot, AssetSlot } from './common'
import { Vector } from '../spatial'

export interface Landmark {
  shape: Shape
  entries: EntrySlot[]
  assets: AssetSlot[]
}

export const hub: Landmark = {
  shape: new Rectangle(0, 0, 7, 7),
  entries: [
    { position: new Vector(3, -1), direction: 'up', width: 3 },
    { position: new Vector(-1, 3), direction: 'left', width: 3 },
    { position: new Vector(7, 3), direction: 'right', width: 3 },
    { position: new Vector(4, 7), direction: 'down', width: 3 },
  ],
  assets: [],
}
