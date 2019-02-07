import { TlbWorld } from '../tlb'
import { AbstractState } from './state'

export class Fighting extends AbstractState {
  public constructor() {
    super(['fov', 'light'])
  }

  public start(world: TlbWorld): void {
    super.start(world)
  }

  public isFrameLocked(): boolean {
    return true
  }
}
