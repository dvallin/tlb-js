import { TlbWorld } from "../tlb"

export interface State {
    start(world: TlbWorld): void
    tick(world: TlbWorld): void
    isDone(world: TlbWorld): boolean
    isFrameLocked(): boolean
}
