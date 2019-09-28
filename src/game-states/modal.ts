import { TlbWorld, SystemName } from '../tlb'
import { AbstractState } from './state'
import { UIResource, UI } from '../resources/ui'

export class Modal extends AbstractState {
  public constructor(systems: SystemName[]) {
    super(
      systems.filter(s => s !== 'free-mode-control' && s !== 'player-control' && s !== 'player-round-control' && s !== 'player-interaction')
    )
  }

  public update(_world: TlbWorld): void {}

  public isDone(world: TlbWorld): boolean {
    const ui: UI = world.getResource<UIResource>('ui')
    return !ui.isModal
  }

  public isFrameLocked(): boolean {
    return true
  }
}
