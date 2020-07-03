import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
export declare class PlayerControl implements TlbSystem {
    readonly components: ComponentName[];
    update(world: TlbWorld, entity: Entity): void;
}
