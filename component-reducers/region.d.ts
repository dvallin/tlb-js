import { TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
import { PositionComponent } from '../components/position';
export declare function isAuthorized(world: TlbWorld, position: PositionComponent, entity: Entity): boolean;
export declare function authorize(world: TlbWorld, position: PositionComponent, entity: Entity): void;
