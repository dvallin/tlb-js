import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { FovComponent } from '../components/fov'
import { Queries } from '../renderer/queries'
import { Entity } from '../ecs/entity'

export class Fov implements TlbSystem {
  public readonly components: ComponentName[] = ['fov', 'position']

  public constructor(public readonly queries: Queries) {}

  public update(world: TlbWorld, entity: Entity): void {
    const fov = world.getComponent<FovComponent>(entity, 'fov')!
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    fov.fov = []
    this.queries.fov(world, position.position, (position, distance) => fov.fov.push({ position, distance }))
  }
}
