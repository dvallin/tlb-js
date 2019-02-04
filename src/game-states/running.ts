import { TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { Vector } from '../spatial'
import { AbstractState } from './state'
import { FeatureComponent } from 'src/components/feature'
import { WorldMap } from 'src/resources/world-map'
import { FovComponent } from 'src/components/fov'

export class Running extends AbstractState {
  public constructor() {
    super(['fov', 'light', 'player-control', 'player-interaction', 'trigger', 'free-mode-control'])
  }

  public start(world: TlbWorld): void {
    super.start(world)
    const spawns = world.components.get('spawn')!
    if (spawns.size() === 1) {
      const map = world.getResource<WorldMap>('map')
      spawns.foreach(spawn => {
        const position = world.getComponent<PositionComponent>(spawn, 'position')!.position
        const player = world
          .createEntity()
          .withComponent<{}>('player', {})
          .withComponent<{}>('viewport-focus', {})
          .withComponent<PositionComponent>('position', { position })
          .withComponent<FeatureComponent>('feature', { type: 'player' })
          .withComponent<FovComponent>('fov', { fov: [] }).entity
        map.setCharacter(position, player)
      })
    } else {
      const position = new Vector(20, 20)
      world
        .createEntity()
        .withComponent<{}>('free-mode-anchor', {})
        .withComponent<{}>('viewport-focus', {})
        .withComponent<PositionComponent>('position', { position })
    }
  }

  public isFrameLocked(): boolean {
    return true
  }
}
