import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
import { Vector } from '../spatial';
export declare class Script implements TlbSystem {
    readonly components: ComponentName[];
    update(world: TlbWorld, entity: Entity): void;
    moveOrTrigger(world: TlbWorld, entity: Entity, target: Vector): boolean;
}
