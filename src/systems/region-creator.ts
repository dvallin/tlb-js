import { ComponentName, TlbSystem, ResourceName, SystemName } from '../tlb'
import { World } from '../ecs/world'
import { RegionComponent } from '../components/region'
import { Rectangle } from '../geometry/rectangle'
import { ParentComponent } from '../components/parent'
import { Difference } from '../geometry/difference'
import { Shape } from '../geometry/shape'
import { LandmarkGenerator } from '../assets/landmark-generator'
import { AgentComponent } from '../components/agent'
import { PositionComponent } from '../components/position'
import { Random } from '../random'

export class RegionCreator implements TlbSystem {
  public readonly components: ComponentName[] = ['region', 'root', 'active']

  public readonly landmarkGenerator: LandmarkGenerator
  public constructor(public readonly random: Random) {
    this.landmarkGenerator = new LandmarkGenerator(random)
  }

  public update(world: World<ComponentName, SystemName, ResourceName>, entity: number): void {
    const rootRegion = world.getComponent<RegionComponent>(entity, 'region')!
    const landmark = this.landmarkGenerator.generate(rootRegion.shape.bounds().center)
    rootRegion.landmarks = [landmark]
    landmark.entries.forEach(entry => {
      world
        .createEntity()
        .withComponent<AgentComponent>('agent', { actions: [], direction: entry.direction, width: entry.width, generation: 0 })
        .withComponent<PositionComponent>('position', { position: entry.position })
        .withComponent('active', {})
    })

    const subRegionShapes = this.growSubRegionShapes(rootRegion)
    subRegionShapes.forEach(shape => this.addSubShape(world, entity, shape))
    world.editEntity(entity).removeComponent('active')
  }

  private addSubShape(world: World<ComponentName, SystemName, ResourceName>, entity: number, shape: Shape) {
    world
      .createEntity()
      .withComponent<ParentComponent>('parent', { entity })
      .withComponent<RegionComponent>('region', { shape, landmarks: [] })
  }

  private growSubRegionShapes(rootRegion: RegionComponent): Shape[] {
    const outerShape = rootRegion.shape.bounds().grow(rootRegion.shape.bounds().width / 2)
    return [
      Rectangle.fromBounds(outerShape.left, outerShape.center.x, outerShape.top, outerShape.center.y),
      Rectangle.fromBounds(outerShape.center.x + 1, outerShape.right, outerShape.top, outerShape.center.y),
      Rectangle.fromBounds(outerShape.left, outerShape.center.x, outerShape.center.y + 1, outerShape.bottom),
      Rectangle.fromBounds(outerShape.center.x + 1, outerShape.right, outerShape.center.y + 1, outerShape.bottom),
    ].map(shape => new Difference(shape, outerShape))
  }
}
