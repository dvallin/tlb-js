import { TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
import { AssetType } from '../assets/assets';
export declare function getTriggersOfStructure(world: TlbWorld, entity: Entity, filter: AssetType[]): Entity[];
