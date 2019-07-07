import { KEYS } from 'rot-js'

import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { Input, InputResource } from '../resources/input'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { FunctionalShape } from '../geometry/functional-shape'
import { Shape } from '../geometry/shape'
import { Entity } from '../ecs/entity'
import { TriggeredByComponent } from '../components/trigger'

export class PlayerInteraction implements TlbSystem {
  public readonly components: ComponentName[] = ['player', 'position']

  public update(world: TlbWorld, entity: Entity): void {
    const input: Input = world.getResource<InputResource>('input')
    if (input.keyPressed.has(KEYS.VK_E)) {
      const map: WorldMap = world.getResource<WorldMapResource>('map')
      const position = world.getComponent<PositionComponent>(entity, 'position')!
      const neighbourhood = FunctionalShape.lN(position.position.floor(), 1, true)

      const trigger = this.findTrigger(world, map, neighbourhood)
      if (trigger !== undefined) {
        world
          .editEntity(trigger)
          .withComponent('active', {})
          .withComponent<TriggeredByComponent>('triggered-by', { entity })
      }
    }
  }

  public findTrigger(world: TlbWorld, map: WorldMap, shape: Shape): Entity | undefined {
    let trigger: Entity | undefined
    shape.some(p => {
      const entity = map.getTile(p)
      if (entity !== undefined) {
        if (world.getComponent(entity, 'triggers') !== undefined) {
          trigger = entity
          return true
        }
        const triggeredBy = world.getComponent<TriggeredByComponent>(entity, 'triggered-by')
        if (triggeredBy !== undefined) {
          if (world.getComponent(triggeredBy.entity, 'triggers') !== undefined) {
            trigger = triggeredBy.entity
            return true
          }
        }
      }
      return false
    })
    return trigger
  }
}
