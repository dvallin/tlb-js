import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { TakeTurnComponent } from '../components/rounds';
import { Queries } from '../renderer/queries';
import { Entity } from '../ecs/entity';
import { SelectedActionComponent, Movement, Attack, Status } from '../components/action';
import { ActionGroup } from '../ui/tabs/action-selector';
import { Random } from '../random';
export declare class PlayerRoundControl implements TlbSystem {
    readonly queries: Queries;
    readonly random: Random;
    readonly components: ComponentName[];
    constructor(queries: Queries, random: Random);
    update(world: TlbWorld, entity: Entity): void;
    doTurn(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent, availableActions: ActionGroup[]): void;
    handleSubAction(world: TlbWorld, entity: Entity, subAction: Movement | Attack | Status, selectedAction: SelectedActionComponent): boolean;
    endTurn(world: TlbWorld, entity: Entity): void;
    clearAction(world: TlbWorld, entity: Entity): void;
    move(world: TlbWorld, entity: Entity, movement: Movement): boolean;
    findTarget(world: TlbWorld, entity: Entity, attack: Attack): Entity | undefined;
    attackTarget(world: TlbWorld, entity: Entity, attack: Attack, target: Entity): boolean;
    status(world: TlbWorld, entity: Entity, status: Status): boolean;
}
