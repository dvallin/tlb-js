import { Color } from 'src/renderer/color'
import { Entity } from 'src/ecs/entity'

export interface LightComponent {
  color: Color
}
export interface LightingComponent {
  incomingLight: Map<Entity, Color>
}
