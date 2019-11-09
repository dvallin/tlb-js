import { TlbWorld } from '../tlb'
import { RegionComponent, RegionsType } from '../components/region'
import { Rectangle } from '../geometry/rectangle'
import { Shape } from '../geometry/shape'
import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'

function regionComponent(type: RegionsType, shape: Shape, exits: Vector[], level: number): RegionComponent {
  return { type, shape, level, exits, authorized: new Set() }
}

export function create(world: TlbWorld): Entity {
  const elevatorRegion = new Rectangle(50, 25, 20, 20)
  world
    .createEntity()
    .withComponent<RegionComponent>('region', regionComponent('elevator', elevatorRegion, [new Vector([50, 28])], 0))
    .withComponent('active', {})
  world
    .createEntity()
    .withComponent<RegionComponent>('region', regionComponent('elevator', elevatorRegion, [new Vector([50, 28])], 1))
    .withComponent('active', {})
  world
    .createEntity()
    .withComponent<RegionComponent>('region', regionComponent('red', new Rectangle(0, 0, 50, 50), [new Vector([49, 28])], 1))
    .withComponent('active', {}).entity
  return world
    .createEntity()
    .withComponent<RegionComponent>('region', regionComponent('red', new Rectangle(0, 0, 50, 50), [new Vector([49, 28])], 0))
    .withComponent('active', {}).entity
}
