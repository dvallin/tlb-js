import { Entity } from '../ecs/entity'
import { PositionComponent, centeredPosition } from '../components/position'
import { TlbWorld } from '../tlb'
import { WorldMapResource } from '../resources/world-map'
import { Vector } from '../spatial'

export function placeCharacter(world: TlbWorld, entity: Entity, level: number, position: Vector): void {
  const map = world.getResource<WorldMapResource>('map')
  map.levels[level].setCharacter(position, entity)
  world.editEntity(entity).withComponent<PositionComponent>('position', centeredPosition(level, position))
}
