import { ComponentName, TlbSystem, TlbWorld, PushState } from '../tlb';
import { TakeTurnComponent, SelectionState } from '../components/rounds';
import { Queries } from '../renderer/queries';
import { Entity } from '../ecs/entity';
import { Movement, Attack, Status, Action, SubAction, Jump } from '../components/action';
import { SelectableAction } from '../ui/tabs/action-selector';
import { Distribution } from '../random/distributions';
export declare class PlayerRoundControl implements TlbSystem {
    readonly queries: Queries;
    readonly pushState: PushState;
    rng: Distribution;
    readonly components: ComponentName[];
    private readonly random;
    constructor(queries: Queries, pushState: PushState, rng: Distribution);
    update(world: TlbWorld, entity: Entity): void;
    doTurn(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent, availableActions: SelectableAction[]): void;
    handleSubAction(world: TlbWorld, entity: Entity, action: Action, subAction: SubAction, state: SelectionState): boolean;
    endTurn(world: TlbWorld, entity: Entity): void;
    move(world: TlbWorld, entity: Entity, movement: Movement | Jump): boolean;
    findTarget(world: TlbWorld, entity: Entity, attack: Attack): Entity | undefined;
    status(world: TlbWorld, entity: Entity, status: Status, item: Entity): boolean;
    trigger(world: TlbWorld, entity: Entity, target: Entity): boolean;
    changeEquipment(world: TlbWorld, entity: Entity): boolean;
}
