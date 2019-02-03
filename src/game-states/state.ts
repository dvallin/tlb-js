import { TlbWorld, SystemName } from '../tlb'

export interface State {
  start(world: TlbWorld): void
  stop(world: TlbWorld): void
  isDone(world: TlbWorld): boolean
  isFrameLocked(): boolean
}

export abstract class AbstractState implements State {
  public constructor(public readonly usedSystems: SystemName[]) {}

  public start(world: TlbWorld) {
    this.usedSystems.forEach(s => world.enableSystem(s))
  }

  public stop(world: TlbWorld) {
    this.usedSystems.forEach(s => world.disableSystem(s))
  }

  public isDone(world: TlbWorld) {
    return this.usedSystems.find(s => !world.emptySystems.has(s)) === undefined
  }

  public abstract isFrameLocked(): boolean
}
