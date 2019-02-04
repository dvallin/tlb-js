import { Vector } from 'src/spatial'

export interface FovComponent {
  lastOrigin: Vector | undefined
  fov: Vector[]
}
