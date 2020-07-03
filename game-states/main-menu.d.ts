import { TlbWorld } from '../tlb';
import { AbstractState } from './state';
export declare class MainMenu extends AbstractState {
    constructor();
    start(world: TlbWorld): void;
    isDone(_world: TlbWorld): boolean;
    update(_world: TlbWorld): void;
    isFrameLocked(): boolean;
}
