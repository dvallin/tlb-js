import { TlbWorld } from '../tlb'
import { AbstractState } from './state'
import { Entity } from '../ecs/entity'
import { playerIsDead, playerIsStruggling, turnBasedEntities } from '../component-reducers/turn-based'
import { ViewportResource, Viewport } from '../resources/viewport'

export class Fighting extends AbstractState {
  public constructor() {
    super('fighting', ['start-round', 'player-round-control', 'ai-round-control', 'fov', 'npc', 'script', 'effect'])
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
    super.stop(world)
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    viewport.gridLocked = this.wasGridLocked
  }

  public update(world: TlbWorld): void {
    const noActivePlayer = world.getStorage('start-turn').size() === 0 && world.getStorage('take-turn').size() === 0
    if (noActivePlayer) {
      let next = world.getStorage('wait-turn').first()
      if (next === undefined) {
        this.newRound(world)
        next = world.getStorage('wait-turn').first()!
      }
      this.setNextEntity(world, next)
    }
  }

  public isDone(world: TlbWorld): boolean {
    const isDead = playerIsDead(world)
    const isStruggling = playerIsStruggling(world)
    const onlyPlayerPlays = turnBasedEntities(world) <= world.components.get('player')!.size()
    return isDead || (onlyPlayerPlays && !isStruggling)
  }

  public newRound(world: TlbWorld) {
    world.getStorage('took-turn').foreach(entity => this.addToTurn(world, entity))
    world.getStorage('took-turn').clear()
  }

  public addToTurn(world: TlbWorld, entity: Entity) {
    world.editEntity(entity).withComponent('wait-turn', {})
  }

  public setNextEntity(world: TlbWorld, next: Entity): void {
    world
      .editEntity(next!)
      .withComponent('start-turn', {})
      .removeComponent('wait-turn')
  }

  public isFrameLocked(): boolean {
    return true
  }
}
