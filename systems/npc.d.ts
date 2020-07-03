import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { State } from '../game-states/state';
import { Entity } from '../ecs/entity';
import { Queries } from '../renderer/queries';
import { Distribution } from '../random/distributions';
export declare class Npc implements TlbSystem {
    readonly queries: Queries;
    readonly distribution: Distribution;
    readonly pushState: (state: State) => void;
    readonly components: ComponentName[];
    private readonly random;
    constructor(queries: Queries, distribution: Distribution, pushState: (state: State) => void);
    update(world: TlbWorld, entity: Entity): void;
    private findInterest;
    private tryToAuthorizeInterest;
    private confrontInterest;
}
