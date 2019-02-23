import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { ScriptComponent } from '../components/action'
import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'
import { CharacterStatsComponent, speed } from '../components/character-stats'
import { Line } from '../spatial/line'

export class Script implements TlbSystem {
  public readonly components: ComponentName[] = ['script']

  public update(world: TlbWorld, entity: Entity): void {
    const script = world.getComponent<ScriptComponent>(entity, 'script')!
    const currentAction = script.actions.pop()
    if (currentAction === undefined) {
      console.log('deleted')
      world.editEntity(entity).removeComponent('script')
    } else {
      let done = true
      switch (currentAction.type) {
        case 'move':
          done = this.move(world, entity, currentAction.position!)
          break
        default:
          console.error(`${currentAction.type} is not a known action type`)
          break
      }
      if (!done) {
        script.actions.push(currentAction)
      }
    }
  }

  public move(world: TlbWorld, entity: Entity, target: Vector): boolean {
    const stats = world.getComponent<CharacterStatsComponent>(entity, 'character-stats')!
    const current = world.getComponent<PositionComponent>(entity, 'position')!
    const delta = target.center.minus(current.position).normalize()
    if (delta.isNan()) {
      console.warn('target already reached')
      return true
    }

    const movement = delta.mult(speed(stats))
    const newPosition = current.position.add(movement)
    const finishLine = new Line(target.center, delta.perpendicular())
    if (finishLine.side(current.position) !== finishLine.side(newPosition)) {
      current.position = target.center
      return true
    } else {
      current.position = newPosition
      return false
    }
  }
}
