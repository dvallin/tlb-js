import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { Input, InputResource } from '../resources/input'
import { WorldMapResource } from '../resources/world-map'
import { Entity } from '../ecs/entity'
import { CharacterStatsComponent, speed } from '../components/character-stats'

export class PlayerControl implements TlbSystem {
  public readonly components: ComponentName[] = ['player', 'position', 'character-stats']

  public update(world: TlbWorld, entity: Entity): void {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const stats = world.getComponent<CharacterStatsComponent>(entity, 'character-stats')!
    const input: Input = world.getResource<InputResource>('input')
    const delta = input.createMovementDelta()
    if (delta.squaredLength() > 0) {
      const newPosition = position.position.add(delta.mult(speed(stats)))
      const level = world.getResource<WorldMapResource>('map').levels[position.level]
      if (!level.isBlocking(world, newPosition.floor(), entity)) {
        level.removeCharacter(position.position.floor())
        level.setCharacter(newPosition.floor(), entity)
        world.editEntity(entity).withComponent<PositionComponent>('position', { level: position.level, position: newPosition })
      }
    }
  }
}
