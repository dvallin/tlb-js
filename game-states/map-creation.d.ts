import { TlbWorld } from '../tlb';
import { AbstractState } from './state';
export declare class MapCreation extends AbstractState {
    private startRegion;
    constructor();
    start(world: TlbWorld): void;
    update({}: TlbWorld): void;
    stop(world: TlbWorld): void;
    isFrameLocked(): boolean;
    private fillWalls;
}
