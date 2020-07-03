import { TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
import { SelectableAction } from '../ui/tabs/action-selector';
export declare function calculateAvailableActions(world: TlbWorld, entity: Entity, withConsumables: boolean): SelectableAction[];
