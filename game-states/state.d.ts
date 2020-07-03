import { TlbWorld, SystemName } from '../tlb';
export interface State {
    name: string;
    start(world: TlbWorld): void;
    update(world: TlbWorld, pushState: (state: State) => void): void;
    stop(world: TlbWorld): void;
    isDone(world: TlbWorld): boolean;
    isFrameLocked(): boolean;
}
export declare abstract class AbstractState implements State {
    readonly name: string;
    readonly usedSystems: SystemName[];
    constructor(name: string, usedSystems: SystemName[]);
    start(world: TlbWorld): void;
    stop(_world: TlbWorld): void;
    isDone(world: TlbWorld): boolean;
    abstract update(world: TlbWorld, pushState: (state: State) => void): void;
    abstract isFrameLocked(): boolean;
}
