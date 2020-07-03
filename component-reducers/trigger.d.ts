import { TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
import { TriggersComponent } from '../components/trigger';
import { Shape } from '../geometry/shape';
export declare function findTriggers(world: TlbWorld, level: number, shape: Shape): {
    entity: Entity;
    component: TriggersComponent;
}[];
export declare function findTriggerOfEntity(world: TlbWorld, entity: Entity): Entity | undefined;
