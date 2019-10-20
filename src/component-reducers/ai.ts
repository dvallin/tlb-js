import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { AiComponent } from '../components/ai'
import { Fighting } from '../game-states/fighting'
import { turnBasedEntities } from './turn-based'
import { State } from '../game-states/state'

export function engage(world: TlbWorld, entity: Entity, ai: AiComponent, pushState: (state: State) => void) {
  const othersAlreadyFighting = turnBasedEntities(world) > 0
  ai.state = 'engaging'
  world.editEntity(entity).withComponent('wait-turn', {})
  if (!othersAlreadyFighting) {
    pushState(new Fighting())
  }
}
