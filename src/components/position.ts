import { Vector } from '../spatial'

export interface PositionComponent {
  level: number
  position: Vector
}

export function centeredPosition(level: number, position: Vector): PositionComponent {
  return { level, position: position.center }
}
