import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { Input, InputResource } from '../resources/input'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { FunctionalShape } from '../geometry/functional-shape'
import { Shape } from '../geometry/shape'
import { Entity } from '../ecs/entity'
import { TriggeredByComponent, TriggersComponent } from '../components/trigger'
import { UI, UIResource } from '../resources/ui'
import { State } from '../game-states/state'
import { Modal } from '../game-states/modal'

export class PlayerInteraction implements TlbSystem {
  public readonly components: ComponentName[] = ['player', 'position']

  public constructor(public readonly pushState: (state: State) => void) {}

  public update(world: TlbWorld, entity: Entity): void {
    const ui: UI = world.getResource<UIResource>('ui')
    const input: Input = world.getResource<InputResource>('input')
    let trigger: Entity | undefined
    if (input.isActive('use')) {
      const map: WorldMap = world.getResource<WorldMapResource>('map')
      const position = world.getComponent<PositionComponent>(entity, 'position')!
      const neighbourhood = FunctionalShape.lN(position.position, 1, true)

      const triggers = this.findTriggers(world, map, position.level, neighbourhood)
      if (triggers.length === 1) {
        trigger = triggers[0].entity
      } else if (triggers.length > 1) {
        ui.showMultipleChoiceModal(world, 'interact with', triggers)
        this.pushState(new Modal(world.activeSystemsList()))
      }
    } else if (ui.multipleChoiceModalShowing()) {
      trigger = ui.selectedModalOption()
      ui.hideMultipleChoiceModal()
    }

    if (trigger !== undefined) {
      world
        .editEntity(trigger)
        .withComponent('active', {})
        .withComponent<TriggeredByComponent>('triggered-by', { entity })
    }
  }

  public findTriggers(world: TlbWorld, map: WorldMap, level: number, shape: Shape): { entity: Entity; description: string }[] {
    const seen: Set<Entity> = new Set()
    const triggers: { entity: Entity; description: string }[] = []
    shape.foreach(p => {
      const tile = map.levels[level].getTile(p)
      if (tile !== undefined) {
        registerTrigger(world, seen, tile, triggers)
      }
      const character = map.levels[level].getCharacter(p)
      if (character !== undefined) {
        registerTrigger(world, seen, character, triggers)
      }
    })
    return triggers
  }
}

function registerTrigger(world: TlbWorld, seen: Set<Entity>, owner: Entity, triggers: { entity: Entity; description: string }[]): void {
  const entity = findTriggerOfEntity(world, owner)
  if (entity !== undefined && !seen.has(entity)) {
    seen.add(entity)
    const t = world.getComponent<TriggersComponent>(entity, 'triggers')!
    triggers.push({ entity, description: t.name })
  }
}

function findTriggerOfEntity(world: TlbWorld, entity: Entity): Entity | undefined {
  if (world.getComponent(entity, 'triggers') !== undefined) {
    return entity
  }
  const triggeredBy = world.getComponent<TriggeredByComponent>(entity, 'triggered-by')
  if (triggeredBy !== undefined) {
    if (world.getComponent<TriggersComponent>(triggeredBy.entity, 'triggers') !== undefined) {
      return triggeredBy.entity
    }
  }
  return undefined
}
