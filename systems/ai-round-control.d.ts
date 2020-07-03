import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { TakeTurnComponent, SelectionState } from '../components/rounds';
import { Queries } from '../renderer/queries';
import { Entity } from '../ecs/entity';
import { Vector } from '../spatial';
import { Movement, Attack, Status } from '../components/action';
import { Random } from '../random';
import { SelectableAction } from '../ui/tabs/action-selector';
import { Distribution } from '../random/distributions';
export declare class AiRoundControl implements TlbSystem {
    readonly queries: Queries;
    readonly components: ComponentName[];
    readonly random: Random;
    constructor(queries: Queries, distribution: Distribution);
    update(world: TlbWorld, entity: Entity): void;
    selectAction(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent, selectableActions: SelectableAction[]): void;
    takeAction(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent, state: SelectionState): void;
    move(world: TlbWorld, entity: Entity, target: Entity, movement: Movement): void;
    attack(world: TlbWorld, entity: Entity, target: Entity, attack: Attack): void;
    findTarget(world: TlbWorld, position: Vector): Entity | undefined;
    status(world: TlbWorld, entity: Entity, status: Status, item: Entity): boolean;
    endTurn(world: TlbWorld, entity: Entity): void;
}
