import { ComponentName, TlbSystem, ResourceName, SystemName } from '../tlb'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/position'
import { Input } from '../resources/input'

export class FreeModeControl implements TlbSystem {
  public readonly components: ComponentName[] = ['free-mode-anchor', 'position']

  public update(world: World<ComponentName, SystemName, ResourceName>, entity: number): void {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const input = world.getResource<Input>('input')
    const delta = input.createMovementDelta()
    if (delta.squaredLength() > 0) {
      const newPosition = position.position.add(delta)
      world.editEntity(entity).withComponent('position', { position: newPosition })
    }
  }
}
