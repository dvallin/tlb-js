import { TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
import { TakeTurnComponent } from '../components/rounds';
import { ActionGroup } from '../ui/tabs/action-selector';
export declare function calculateAvailableActions(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent): ActionGroup[];
