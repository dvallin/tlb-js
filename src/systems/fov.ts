import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { FovComponent } from 'src/components/fov'
import { ShadowCaster } from 'src/renderer/shadow-caster'

export class Fov implements TlbSystem {
  public readonly components: ComponentName[] = ['fov', 'position']

  public constructor(public readonly shadowCaster: ShadowCaster) {}

  public update(world: TlbWorld, entity: number): void {
    const fov = world.getComponent<FovComponent>(entity, 'fov')!
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    fov.fov = []
    this.shadowCaster.calculate(world, position.position.floor(), p => fov.fov.push(p))
  }
}
