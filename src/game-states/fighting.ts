import { TlbWorld } from '../tlb'
import { AbstractState } from './state'
import { Entity } from '../ecs/entity'
import { TakeTurnComponent } from '../components/rounds'
import { CharacterStatsComponent } from '../components/character-stats'
import { ViewportResource } from '../resources/viewport'

export class Fighting extends AbstractState {
  public constructor() {
    super(['fov', 'light', 'player-round-control', 'script'])
  }

  private wasGridLocked: boolean = true

  public start(world: TlbWorld): void {
    super.start(world)
    this.addCharactersToRound(world)
    this.setStartingEntity(world)
    const viewport = world.getResource<ViewportResource>('viewport')
    this.wasGridLocked = viewport.gridLocked
    viewport.gridLocked = true
  }

  public stop(world: TlbWorld): void {
    const viewport = world.getResource<ViewportResource>('viewport')
    viewport.gridLocked = this.wasGridLocked
  }

  public addCharactersToRound(world: TlbWorld): void {
    world.components.get('character-stats')!.foreach(entity => {
      world.editEntity(entity).withComponent('wait-turn', {})
    })
  }

  public setStartingEntity(world: TlbWorld): void {
    let startingEntity: Entity
    world.components.get('player')!.foreach(entity => (startingEntity = entity))
    const stats = world.getComponent<CharacterStatsComponent>(startingEntity!, 'character-stats')!
    world
      .editEntity(startingEntity!)
      .withComponent<TakeTurnComponent>('take-turn', {
        movements: stats.current.movement,
        actions: stats.current.actions,
      })
      .removeComponent('wait-turn')
  }

  public isFrameLocked(): boolean {
    return true
  }
}
