import { Landmark } from '../assets/landmarks'
import { Shape } from '../geometry/shape'

export interface RegionComponent {
  shape: Shape
  landmarks: Landmark[]
}
