import { TlbWorld, SystemName } from '../tlb';
import { AbstractState } from './state';
export declare class Modal extends AbstractState {
    constructor(systems: SystemName[]);
    update(_world: TlbWorld): void;
    isDone(world: TlbWorld): boolean;
    isFrameLocked(): boolean;
}
