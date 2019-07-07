import { TlbWorld, SystemName } from '../tlb'

export interface State {
  start(world: TlbWorld): void
  update(world: TlbWorld): void
  stop(world: TlbWorld): void
  isDone(world: TlbWorld): boolean
  isFrameLocked(): boolean
}

export abstract class AbstractState implements State {
  public constructor(public readonly usedSystems: SystemName[]) {}

  public start(world: TlbWorld) {
    world.activeSystems.forEach(s => world.disableSystem(s))
    this.usedSystems.forEach(s => world.enableSystem(s))
  }

  public stop(_world: TlbWorld) {}

  public isDone(world: TlbWorld) {
    return this.usedSystems.find(s => !world.emptySystems.has(s)) === undefined
  }

  public abstract update(world: TlbWorld): void
  public abstract isFrameLocked(): boolean
}
