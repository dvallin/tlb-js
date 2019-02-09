import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { FovComponent } from '../components/fov'
import { State } from '../game-states/state'
import { Vector } from '../spatial'
import { Fighting } from '../game-states/fighting'

export class Npc implements TlbSystem {
  public readonly components: ComponentName[] = ['npc', 'fov']

  public constructor(public readonly pushState: (state: State) => void) {}

  public update(world: TlbWorld, entity: number): void {
    const fov = world.getComponent<FovComponent>(entity, 'fov')!
    world.components.get('player')!.foreach(player => {
      const playerPosition = world.getComponent<PositionComponent>(player, 'position')
      if (playerPosition !== undefined) {
        const playerKey = playerPosition.position.floor().key
        fov.fov.forEach((v: Vector) => {
          if (playerKey === v.floor().key) {
            this.pushState(new Fighting())
          }
        })
      }
    })
  }
}
