import { WorldMapResource } from '../resources/world-map'
import { Vector } from '../spatial'
import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { PositionComponent } from '../components/position'

export function move(world: TlbWorld, entity: Entity, level: number, position: Vector): void {
  const l = world.getResource<WorldMapResource>('map').levels[level]
  if (l !== undefined && !l.isBlocking(world, position, entity)) {
    const oldPosition = world.getComponent<PositionComponent>(entity, 'position')!
    l.removeCharacter(oldPosition.position)
    l.setCharacter(position, entity)
    world.editEntity(entity).withComponent<PositionComponent>('position', { level, position })
  }
}
