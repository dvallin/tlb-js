import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { Input } from '../resources/input'
import { WorldMap } from 'src/resources/world-map'

export class PlayerControl implements TlbSystem {
  public readonly components: ComponentName[] = ['player', 'position']

  public update(world: TlbWorld, entity: number): void {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const input = world.getResource<Input>('input')
    const delta = input.createMovementDelta()
    if (delta.squaredLength() > 0) {
      const newPosition = position.position.add(delta.mult(0.13))
      const map = world.getResource<WorldMap>('map')
      if (!map.isTileBlocking(world, newPosition.floor())) {
        map.removeCharacter(position.position.floor())
        map.setCharacter(newPosition.floor(), entity)
        world.editEntity(entity).withComponent('position', { position: newPosition })
      }
    }
  }
}
