import { TlbWorld } from '../tlb'
import { AbstractState } from './state'
import { Entity } from '../ecs/entity'
import { TakeTurnComponent } from '../components/rounds'
import { CharacterStatsComponent } from '../components/character-stats'
import { ViewportResource, Viewport } from '../resources/viewport'

export class Fighting extends AbstractState {
  public constructor() {
    super(['fov', 'light', 'player-round-control', 'npc', 'ai-round-control', 'script', 'damage'])
  }

  private wasGridLocked: boolean = true

  public start(world: TlbWorld): void {
    super.start(world)

    let next: Entity = world.getStorage('player').first()!
    this.setNextEntity(world, next)

    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    this.wasGridLocked = viewport.gridLocked
    viewport.gridLocked = true
  }

  public stop(world: TlbWorld): void {
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    viewport.gridLocked = this.wasGridLocked
  }

  public update(world: TlbWorld): void {
    if (world.getStorage('take-turn').size() === 0) {
      let next = world.getStorage('wait-turn').first()
      if (next === undefined) {
        this.newRound(world)
        next = world.getStorage('wait-turn').first()!
      }
      this.setNextEntity(world, next)
    }
  }

  public isDone(world: TlbWorld) {
    const turnBasedEntities =
      world.components.get('wait-turn')!.size() + world.components.get('take-turn')!.size() + world.components.get('took-turn')!.size()
    return turnBasedEntities <= world.components.get('player')!.size()
  }

  public newRound(world: TlbWorld) {
    world.getStorage('took-turn').foreach(entity => this.addToTurn(world, entity))
    world.getStorage('took-turn').clear()
  }

  public addToTurn(world: TlbWorld, entity: Entity) {
    world.editEntity(entity).withComponent('wait-turn', {})
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
  }

  public isFrameLocked(): boolean {
    return true
  }
}
