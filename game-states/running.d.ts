import { TlbWorld } from '../tlb';
import { AbstractState, State } from './state';
import { WorldMap } from '../resources/world-map';
import { Entity } from '../ecs/entity';
export declare class Running extends AbstractState {
    constructor();
    start(world: TlbWorld): void;
    createViewportFocus(world: TlbWorld): void;
    spawnPlayer(world: TlbWorld, map: WorldMap, spawn: Entity): void;
    createUILayer(world: TlbWorld): void;
    update(world: TlbWorld, pushState: (state: State) => void): void;
    isFrameLocked(): boolean;
}
