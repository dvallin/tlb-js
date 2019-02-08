import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { Input, InputResource } from '../resources/input'
import { WorldMap, WorldMapResource } from 'src/resources/world-map'

export class PlayerControl implements TlbSystem {
  public readonly components: ComponentName[] = ['player', 'position']

  public update(world: TlbWorld, entity: number): void {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const input: Input = world.getResource<InputResource>('input')
    const delta = input.createMovementDelta()
    if (delta.squaredLength() > 0) {
      const newPosition = position.position.add(delta.mult(0.13))
      const map: WorldMap = world.getResource<WorldMapResource>('map')
      if (!map.isTileBlocking(world, newPosition.floor())) {
        map.removeCharacter(position.position.floor())
        map.setCharacter(newPosition.floor(), entity)
        world.editEntity(entity).withComponent('position', { position: newPosition })
      }
    }
  }
}
