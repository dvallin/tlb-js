import { Vector } from '../spatial'

export interface FovComponent {
  fov: {
    position: Vector
    distance: number
  }[]
}
