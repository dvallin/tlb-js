import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { RegionComponent } from '../components/region'
import { Rectangle } from '../geometry/rectangle'
import { LandmarkGenerator } from '../assets/landmark-generator'
import { AgentComponent } from '../components/agent'
import { PositionComponent } from '../components/position'
import { Random } from '../random'
import { Entity } from '../ecs/entity'
import { EntrySlot } from '../assets/common'
import { Shape } from '../geometry/shape'
import { Landmark } from '../assets/landmarks'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { createFeature } from '../components/feature'

export class RegionCreator implements TlbSystem {
  public readonly components: ComponentName[] = ['active', 'region']

  public readonly landmarkGenerator: LandmarkGenerator
  public constructor(public readonly random: Random) {
    this.landmarkGenerator = new LandmarkGenerator(random)
  }

  public update(world: TlbWorld, entity: Entity): void {
    const rootRegion = world.getComponent<RegionComponent>(entity, 'region')!

    const leftLandmark = this.buildLeftLandmark(world, entity, rootRegion)
    const centralLandmark = this.buildCentralLandmark(world, entity, rootRegion)
    rootRegion.landmarks = [centralLandmark, leftLandmark]

    world.editEntity(entity).removeComponent('active')
  }

  public buildCentralLandmark(world: TlbWorld, entity: Entity, region: RegionComponent): Landmark {
    const centralLandmark = this.landmarkGenerator.generate(region.shape.bounds().center)

    centralLandmark.entries.forEach(entry => this.spawnAgent(world, entry, entity))

    this.renderLandmark(world, centralLandmark)

    return centralLandmark
  }

  public buildLeftLandmark(world: TlbWorld, entity: Entity, region: RegionComponent): Landmark {
    const rootBounds = region.shape.bounds()
    const newRegion = this.createRegion(
      world,
      Rectangle.fromBounds(
        rootBounds.right,
        rootBounds.right + rootBounds.width,
        rootBounds.top + rootBounds.width / 4,
        rootBounds.bottom - rootBounds.width / 4
      )
    )

    const leftLandmark = this.landmarkGenerator.generate(rootBounds.centerRight)
    leftLandmark.entries = leftLandmark.entries.filter(entry => entry.direction === 'left' || entry.direction === 'right')
    leftLandmark.entries.forEach(entry => {
      const allowedRegion = entry.direction === 'left' ? entity : newRegion
      this.spawnAgent(world, entry, allowedRegion)
    })

    this.renderLandmark(world, leftLandmark)
    return leftLandmark
  }

  public createRegion(world: TlbWorld, shape: Shape): Entity {
    return world.createEntity().withComponent<RegionComponent>('region', { shape: shape, landmarks: [] }).entity
  }

  public spawnAgent(world: TlbWorld, entry: EntrySlot, allowedRegion: Entity): void {
    world
      .createEntity()
      .withComponent<AgentComponent>('agent', {
        actions: [],
        direction: entry.direction,
        width: entry.width,
        generation: 0,
        allowedRegion,
      })
      .withComponent<PositionComponent>('position', { position: entry.position })
      .withComponent('active', {})
  }

  public renderLandmark(world: TlbWorld, landmark: Landmark) {
    const map: WorldMap = world.getResource<WorldMapResource>('map')!
    landmark.shape.foreach(p => createFeature(world, map, p, 'hub'))
  }
}
