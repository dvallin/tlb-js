import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { Input, InputResource } from '../resources/input'
import { Entity } from '../ecs/entity'
import { CharacterStatsComponent, speed } from '../components/character-stats'
import { Vector } from '../spatial'
import { move } from '../component-reducers/position'

export class PlayerControl implements TlbSystem {
  public readonly components: ComponentName[] = ['player', 'position', 'character-stats']

  public update(world: TlbWorld, entity: Entity): void {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const stats = world.getComponent<CharacterStatsComponent>(entity, 'character-stats')!
    const input: Input = world.getResource<InputResource>('input')
    const delta = input.createMovementDelta()

    let newPosition: Vector | undefined = undefined
    let newLevel: number | undefined = undefined
    if (delta.squaredLength() > 0) {
      newPosition = position.position.add(delta.mult(speed(stats)))
      newLevel = position.level
    }
    if (input.isActive('plus')) {
      newPosition = position.position
      newLevel = position.level + 1
    }
    if (input.isActive('minus')) {
      newPosition = position.position
      newLevel = position.level - 1
    }
    if (newPosition !== undefined && newLevel !== undefined) {
      move(world, entity, newLevel, newPosition)
    }
  }
}
