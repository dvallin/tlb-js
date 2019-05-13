import { Color } from '../renderer/color'
import { Entity } from '../ecs/entity'

export interface LightComponent {
  color: Color
}
export interface LightingComponent {
  incomingLightInFrame: Map<Entity, Color>
  incomingLight: Map<Entity, Color>
}
