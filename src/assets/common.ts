import { Direction } from '../spatial/direction'
import { Vector } from '../spatial'

export interface EntrySlot {
  position: Vector
  direction: Direction
  width: number
}

export interface AssetSlot {
  position: Vector
}
