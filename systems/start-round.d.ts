import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
import { Random } from '../random';
export declare class StartRound implements TlbSystem {
    readonly random: Random;
    readonly components: ComponentName[];
    constructor(random: Random);
    update(world: TlbWorld, entity: Entity): void;
}
