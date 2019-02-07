import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { FovComponent } from '../components/fov'
import { RayCaster } from '../renderer/ray-caster'

export class Fov implements TlbSystem {
  public readonly components: ComponentName[] = ['fov', 'position']

  public constructor(public readonly rayCaster: RayCaster) {}

  public update(world: TlbWorld, entity: number): void {
    const fov = world.getComponent<FovComponent>(entity, 'fov')!
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    fov.fov = []
    this.rayCaster.fov(world, position.position.floor(), p => fov.fov.push(p))
  }
}
