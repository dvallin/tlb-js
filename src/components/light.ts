import { Color } from '../renderer/color'
import { Entity } from '../ecs/entity'
import { TlbWorld } from 'src/tlb'
import { WorldMap } from 'src/resources/world-map'
import { Vector } from 'src/spatial'
import { PositionComponent } from './position'

export interface LightComponent {
  color: Color
}
export interface LightingComponent {
  incomingLightInFrame: Map<Entity, Color>
  incomingLight: Map<Entity, Color>
}

export function createLight(world: TlbWorld, map: WorldMap, level: number, position: Vector, color: Color): void {
  const entity = world
    .createEntity()
    .withComponent<LightComponent>('light', { color })
    .withComponent<PositionComponent>('position', { level, position })
    .withComponent('active', {}).entity
  map.levels[level].addLight(position, entity)
}
