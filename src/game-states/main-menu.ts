import { TlbWorld } from '../tlb'
import { AbstractState } from './state'
import { PositionComponent } from '../components/position'

export class MainMenu extends AbstractState {
  public constructor() {
    super(['free-mode-control'])
  }

  public start(world: TlbWorld) {
    super.start(world)
    const focus = world.getStorage('viewport-focus').first()!
    world.getStorage('viewport-focus').clear()

    const position = world.getComponent<PositionComponent>(focus, 'position')!
    world
      .createEntity()
      .withComponent<{}>('free-mode-anchor', {})
      .withComponent('viewport-focus', {})
      .withComponent<PositionComponent>('position', { ...position })
  }

  public isDone(_world: TlbWorld) {
    return false
  }

  public update(_world: TlbWorld): void {}

  public isFrameLocked(): boolean {
    return true
  }
}
