import { TlbWorld } from '../tlb'
import { AbstractState } from './state'

import { RegionComponent } from '../components/region'

import { Rectangle } from '../geometry/rectangle'
import { Entity } from 'src/ecs/entity'
import { PositionComponent } from 'src/components/position'

export class MapCreation extends AbstractState {
  private startRegion: Entity | undefined

  public constructor() {
    super(['region-creator', 'agent'])
  }

  public start(world: TlbWorld): void {
    super.start(world)
    this.startRegion = world
      .createEntity()
      .withComponent<RegionComponent>('region', {
        shape: new Rectangle(0, 0, 50, 50),
        landmarks: [],
      })
      .withComponent('active', {}).entity
  }

  public stop(world: TlbWorld): void {
    super.stop(world)
    if (this.startRegion !== undefined) {
      const region = world.getComponent<RegionComponent>(this.startRegion, 'region')!
      const position = region.landmarks[0].shape.bounds().center
      world
        .createEntity()
        .withComponent<PositionComponent>('position', { position })
        .withComponent('spawn', {})
    }
  }

  public isFrameLocked(): boolean {
    return false
  }
}
