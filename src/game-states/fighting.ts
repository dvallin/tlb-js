import { TlbWorld } from '../tlb'
import { AbstractState } from './state'
import { Entity } from '../ecs/entity'
import { TakeTurnComponent } from '../components/rounds'
import { CharacterStatsComponent } from '../components/character-stats'
import { ViewportResource } from '../resources/viewport'

export class Fighting extends AbstractState {
  public constructor() {
    super(['fov', 'light', 'player-round-control', 'ai-round-control', 'script', 'damage'])
  }

  private wasGridLocked: boolean = true

  public start(world: TlbWorld): void {
    super.start(world)
    this.addCharactersToRound(world)

    let next: Entity = world.getStorage('player').first()!
    this.setNextEntity(world, next)

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

  public update(world: TlbWorld): void {
    if (world.getStorage('take-turn').size() === 0) {
      let next = world.getStorage('wait-turn').first()
      if (next !== undefined) {
        world.getStorage('took-turn').foreach(entity => {
          world.editEntity(entity).withComponent('wait-turn', {})
        })
        world.getStorage('took-turn').clear()
        next = world.getStorage('wait-turn').first()!
        this.setNextEntity(world, next)
      }
    }
  }

  public setNextEntity(world: TlbWorld, next: Entity): void {
    const stats = world.getComponent<CharacterStatsComponent>(next!, 'character-stats')!
    world
      .editEntity(next!)
      .withComponent<TakeTurnComponent>('take-turn', {
        movements: stats.current.movement,
        actions: stats.current.actions,
      })
      .removeComponent('wait-turn')

    console.log(next, 'is now in turn')
  }

  public isFrameLocked(): boolean {
    return true
  }
}
