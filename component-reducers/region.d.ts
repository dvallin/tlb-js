import { TlbWorld } from '../tlb';
import { RegionComponent } from '../components/region';
import { Entity } from '../ecs/entity';
import { PositionComponent } from '../components/position';
export declare function isAuthorized(world: TlbWorld, position: PositionComponent, entity: Entity): boolean;
export declare function authorize(world: TlbWorld, position: PositionComponent, entity: Entity): void;
export declare function unauthorize(world: TlbWorld, position: PositionComponent, entity: Entity): void;
export declare function getRegion(world: TlbWorld, position: PositionComponent): RegionComponent;
