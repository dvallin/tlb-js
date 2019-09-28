import { Color } from '../renderer/color'
import { Entity } from '../ecs/entity'
import { PositionComponent } from './position'
import { WorldMap } from '../resources/world-map'
import { TlbWorld } from '../tlb'
import { Vector } from '../spatial'

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

export function getLighting(world: TlbWorld, entity: Entity): LightingComponent {
  return (
    world.getComponent<LightingComponent>(entity, 'lighting') || {
      incomingLight: new Map(),
      incomingLightInFrame: new Map(),
    }
  )
}
