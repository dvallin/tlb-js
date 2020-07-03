import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { WorldMap } from '../resources/world-map';
import { Shape } from '../geometry/shape';
import { Entity } from '../ecs/entity';
import { State } from '../game-states/state';
export declare class PlayerInteraction implements TlbSystem {
    readonly pushState: (state: State) => void;
    readonly components: ComponentName[];
    constructor(pushState: (state: State) => void);
    update(world: TlbWorld, entity: Entity): void;
    findTriggers(world: TlbWorld, map: WorldMap, level: number, shape: Shape): {
        entity: Entity;
        description: string;
    }[];
}
