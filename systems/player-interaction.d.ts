import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
import { State } from '../game-states/state';
export declare class PlayerInteraction implements TlbSystem {
    readonly pushState: (state: State) => void;
    readonly components: ComponentName[];
    constructor(pushState: (state: State) => void);
    update(world: TlbWorld, entity: Entity): void;
}
