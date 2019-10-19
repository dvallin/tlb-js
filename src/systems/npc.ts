import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { FovComponent } from '../components/fov'
import { State } from '../game-states/state'
import { Fighting } from '../game-states/fighting'
import { Entity } from '../ecs/entity'
import { AiComponent } from '../components/ai'
import { turnBasedEntities } from '../component-reducers/turn-based'
import { WorldMap, WorldMapResource } from '../resources/world-map'

export class Npc implements TlbSystem {
  public readonly components: ComponentName[] = ['npc', 'ai', 'fov']

  public constructor(public readonly pushState: (state: State) => void) {}

  public update(world: TlbWorld, entity: Entity): void {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const fov = world.getComponent<FovComponent>(entity, 'fov')!
    const ai = world.getComponent<AiComponent>(entity, 'ai')!
    if (ai.state === 'idle') {
      world.components.get('player')!.foreach(player => {
        const playerPosition = world.getComponent<PositionComponent>(player, 'position')
        if (playerPosition !== undefined) {
          const width = map.levels[playerPosition.level].boundary.width
          const playerKey = playerPosition.position.index(width)
          fov.fov.forEach(f => {
            if (playerKey === f.position.index(width)) {
              ai.state = 'engaging'
              world.editEntity(entity).withComponent('wait-turn', {})
              if (turnBasedEntities(world) === 1) {
                this.pushState(new Fighting())
              }
            }
          })
        }
      })
    }
  }
}
