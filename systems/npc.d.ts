import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { State } from '../game-states/state';
import { Entity } from '../ecs/entity';
import { Random } from '../random';
import { Queries } from '../renderer/queries';
export declare class Npc implements TlbSystem {
    readonly queries: Queries;
    readonly random: Random;
    readonly pushState: (state: State) => void;
    readonly components: ComponentName[];
    constructor(queries: Queries, random: Random, pushState: (state: State) => void);
    update(world: TlbWorld, entity: Entity): void;
    private findInterest;
    private tryToAuthorizeInterest;
    private confrontInterest;
}
