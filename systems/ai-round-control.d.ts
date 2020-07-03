import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { TakeTurnComponent } from '../components/rounds';
import { Queries } from '../renderer/queries';
import { Entity } from '../ecs/entity';
import { Vector } from '../spatial';
import { SelectedActionComponent, Movement, Attack } from '../components/action';
import { Random } from '../random';
import { ActionGroup } from '../ui/tabs/action-selector';
export declare class AiRoundControl implements TlbSystem {
    readonly queries: Queries;
    readonly random: Random;
    readonly components: ComponentName[];
    constructor(queries: Queries, random: Random);
    update(world: TlbWorld, entity: Entity): void;
    selectAction(world: TlbWorld, entity: Entity, actionGroups: ActionGroup[]): void;
    takeAction(world: TlbWorld, entity: Entity, takeTurn: TakeTurnComponent, selectedAction: SelectedActionComponent): void;
    move(world: TlbWorld, entity: Entity, target: Entity, movement: Movement): void;
    attack(world: TlbWorld, entity: Entity, target: Entity, attack: Attack): void;
    findTarget(world: TlbWorld, position: Vector): Entity | undefined;
    endTurn(world: TlbWorld, entity: Entity): void;
}
