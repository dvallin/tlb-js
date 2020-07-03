import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { Queries } from '../renderer/queries';
import { Color } from '../renderer/color';
import { Entity } from '../ecs/entity';
export declare class Light implements TlbSystem {
    readonly queries: Queries;
    readonly components: ComponentName[];
    constructor(queries: Queries);
    update(world: TlbWorld, entity: Entity): void;
    addLight(world: TlbWorld, entity: Entity, light: Entity, color: Color): void;
}
