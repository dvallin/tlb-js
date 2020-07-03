import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { Queries } from '../renderer/queries';
import { Entity } from '../ecs/entity';
export declare class Fov implements TlbSystem {
    readonly queries: Queries;
    readonly components: ComponentName[];
    constructor(queries: Queries);
    update(world: TlbWorld, entity: Entity): void;
}
