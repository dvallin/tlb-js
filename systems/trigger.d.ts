import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
import { TriggersComponent } from '../components/trigger';
import { State } from '../game-states/state';
import { Random } from '../random';
export declare class Trigger implements TlbSystem {
    readonly random: Random;
    readonly pushState: (state: State) => void;
    readonly components: ComponentName[];
    constructor(random: Random, pushState: (state: State) => void);
    update(world: TlbWorld, entity: Entity): void;
    handleDialog(world: TlbWorld, entity: Entity, triggers: TriggersComponent): boolean;
    handleAsset(world: TlbWorld, entity: Entity, triggers: TriggersComponent): boolean;
    door(world: TlbWorld, triggers: TriggersComponent): boolean;
    loot(world: TlbWorld, entity: Entity, triggers: TriggersComponent, remove: boolean): boolean;
    log(world: TlbWorld, text: string): void;
    swapGroundAndFeature(world: TlbWorld, entity: Entity): void;
}
