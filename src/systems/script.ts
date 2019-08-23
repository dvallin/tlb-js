import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { ScriptComponent } from '../components/script'
import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'
import { CharacterStatsComponent, speed } from '../components/character-stats'
import { Line } from '../spatial/line'
import { WorldMapResource } from '../resources/world-map'

export class Script implements TlbSystem {
  public readonly components: ComponentName[] = ['script']

  public update(world: TlbWorld, entity: Entity): void {
    const script = world.getComponent<ScriptComponent>(entity, 'script')!
    const nextLocation = script.path.pop()
    if (nextLocation === undefined) {
      world.editEntity(entity).removeComponent('script')
    } else {
      const done = this.move(world, entity, nextLocation)
      if (!done) {
        script.path.push(nextLocation)
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
    let newPosition = current.position.add(movement)
    const map = world.getResource<WorldMapResource>('map')
    const finishLine = new Line(target.center, delta.perpendicular())
    let reached = false
    if (finishLine.side(current.position) !== finishLine.side(newPosition)) {
      newPosition = target.center
      reached = true
    }
    map.levels[current.level].removeCharacter(current.position.floor())
    map.levels[current.level].setCharacter(newPosition.floor(), entity)
    current.position = newPosition
    return reached
  }
}
