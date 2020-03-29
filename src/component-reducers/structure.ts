import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { AssetType } from '../assets/assets'
import { StructureComponent, RegionComponent } from '../components/region'
import { WorldMapResource, WorldMap, Level } from '../resources/world-map'
import { TriggeredByComponent } from '../components/trigger'
import { AssetComponent } from '../components/asset'

export function getTriggersOfStructure(world: TlbWorld, entity: Entity, filter: AssetType[]): Entity[] {
  const structure = world.getComponent<StructureComponent>(entity, 'structure')!
  const region: RegionComponent = world.getComponent<RegionComponent>(structure.region, 'region')!

  const map: WorldMap = world.getResource<WorldMapResource>('map')
  const level: Level = map.levels[region.level]

  const triggers: Set<Entity> = new Set()
  structure.shape.foreach(p => {
    const tile = level.getTile(p)!
    const triggeredBy = world.getComponent<TriggeredByComponent>(tile, 'triggered-by')
    if (triggeredBy !== undefined) {
      triggers.add(triggeredBy.entity)
    }
  })

  const result: Entity[] = []
  triggers.forEach(e => {
    const asset = world.getComponent<AssetComponent>(e, 'asset')!
    if (filter.some(t => t === asset.type)) {
      result.push(e)
    }
  })
  return result
}
