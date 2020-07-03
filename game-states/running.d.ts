import { TlbWorld } from '../tlb';
import { AbstractState, State } from './state';
import { WorldMap } from '../resources/world-map';
import { Entity } from '../ecs/entity';
import { Random } from '../random';
import { Distribution } from '../random/distributions';
export declare class Running extends AbstractState {
    private uniform;
    constructor(rng: Distribution);
    start(world: TlbWorld): void;
    createViewportFocus(world: TlbWorld): void;
    spawnPlayer(world: TlbWorld, random: Random, map: WorldMap, spawn: Entity): void;
    createUILayer(world: TlbWorld): void;
    update(world: TlbWorld, pushState: (state: State) => void): void;
    isFrameLocked(): boolean;
}
