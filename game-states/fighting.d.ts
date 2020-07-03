import { TlbWorld } from '../tlb';
import { AbstractState } from './state';
import { Entity } from '../ecs/entity';
export declare class Fighting extends AbstractState {
    constructor();
    start(world: TlbWorld): void;
    stop(world: TlbWorld): void;
    update(world: TlbWorld): void;
    isDone(world: TlbWorld): boolean;
    newRound(world: TlbWorld): void;
    addToTurn(world: TlbWorld, entity: Entity): void;
    setNextEntity(world: TlbWorld, next: Entity): void;
    isFrameLocked(): boolean;
}
