import { TlbWorld } from '../tlb'
import { StructureComponent, RegionComponent } from '../components/region'
import { Entity } from '../ecs/entity'
import { PositionComponent } from '../components/position'
import { WorldMap, WorldMapResource } from '../resources/world-map'

export function isAuthorized(world: TlbWorld, position: PositionComponent, entity: Entity): boolean {
  const map: WorldMap = world.getResource<WorldMapResource>('map')
  const structure = map.levels[position.level].getStructure(position.position)!
  const room: StructureComponent = world.getComponent<StructureComponent>(structure, 'structure')!
  const region: RegionComponent = world.getComponent<RegionComponent>(room.region, 'region')!
  return region.authorized.has(entity)
}

export function authorize(world: TlbWorld, position: PositionComponent, entity: Entity): void {
  const map: WorldMap = world.getResource<WorldMapResource>('map')
  const structure = map.levels[position.level].getStructure(position.position)!
  const room: StructureComponent = world.getComponent<StructureComponent>(structure, 'structure')!
  const region: RegionComponent = world.getComponent<RegionComponent>(room.region, 'region')!
  region.authorized.add(entity)
}
