import { TlbWorld } from '../tlb'
import { State } from './state'

import { RegionComponent } from '../components/region'

import { Rectangle } from '../geometry/rectangle'

export class MapCreation implements State {
  public start(world: TlbWorld): void {
    world.enableSystem('region-creator')
    world.enableSystem('agent')
    world
      .createEntity()
      .withComponent<RegionComponent>('region', {
        shape: new Rectangle(0, 0, 50, 50),
        landmarks: [],
      })
      .withComponent('active', {})
  }

  public stop(world: TlbWorld): void {
    world.disableSystem('agent')
  }

  public isDone(world: TlbWorld): boolean {
    return world.emptySystems.has('agent')
  }

  public isFrameLocked(): boolean {
    return true
  }
}
