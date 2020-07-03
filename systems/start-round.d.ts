import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
import { Distribution } from '../random/distributions';
export declare class StartRound implements TlbSystem {
    readonly components: ComponentName[];
    private readonly uniform;
    constructor(rng: Distribution);
    update(world: TlbWorld, entity: Entity): void;
}
