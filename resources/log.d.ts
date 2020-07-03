import { ResourceName, TlbResource, TlbWorld } from '../tlb';
import { Renderer } from '../renderer/renderer';
import { Entity } from '../ecs/entity';
import { AttackResult } from '../component-reducers/attack-target';
export interface Log {
    getEntries(offset: number, limit: number): string[];
    text(text: string): void;
    attack(world: TlbWorld, source: Entity, target: Entity, result: AttackResult): void;
    died(world: TlbWorld, entity: Entity): void;
}
export declare class LogResource implements TlbResource, Log {
    readonly kind: ResourceName;
    entries: string[];
    update({}: TlbWorld): void;
    render({}: Renderer): void;
    getEntries(offset: number, limit: number): string[];
    text(text: string): void;
    attack(world: TlbWorld, source: Entity, target: Entity, result: AttackResult): void;
    died(world: TlbWorld, entity: Entity): void;
    percentage(value: number): string;
    getName(world: TlbWorld, entity: Entity): string;
    verbify(source: string, verb: string): string;
    owner(target: string): string;
}
