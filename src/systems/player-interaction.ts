import { VK_E } from 'rot-js'

import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { Input } from '../resources/input'
import { WorldMap } from '../resources/world-map'
import { Neighbourhood } from '../geometry/neighbourhood'
import { Shape } from '../geometry/shape'
import { Entity } from 'src/ecs/entity'
import { ParentComponent } from 'src/components/relation'

export class PlayerInteraction implements TlbSystem {
  public readonly components: ComponentName[] = ['player', 'position']

  public update(world: TlbWorld, entity: number): void {
    const input = world.getResource<Input>('input')
    if (input.keyPressed.has(VK_E)) {
      const map = world.getResource<WorldMap>('map')
      const position = world.getComponent<PositionComponent>(entity, 'position')!
      const neighbourhood = Neighbourhood.L1(position.position.floor(), 1)
      const trigger = this.findTrigger(world, map, neighbourhood)
      if (trigger !== undefined) {
        world.editEntity(trigger).withComponent('active', {})
      }
    }
  }

  private findTrigger(world: TlbWorld, map: WorldMap, shape: Shape): Entity | undefined {
    let trigger: Entity | undefined
    shape.some(p => {
      const entity = map.getTile(p)
      if (entity !== undefined) {
        if (world.getComponent(entity, 'trigger') !== undefined) {
          trigger = entity
          return true
        }
        const parent = world.getComponent<ParentComponent>(entity, 'parent')
        if (parent !== undefined) {
          if (world.getComponent(parent.entity, 'trigger') !== undefined) {
            trigger = parent.entity
            return true
          }
        }
      }
      return false
    })
    return trigger
  }
}
