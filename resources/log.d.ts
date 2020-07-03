import { ResourceName, TlbResource, TlbWorld } from '../tlb';
import { Renderer } from '../renderer/renderer';
import { EffectComponent } from '../components/effects';
import { Entity } from '../ecs/entity';
import { Attack } from '../components/action';
export interface Log {
    getEntries(offset: number, limit: number): string[];
    text(text: string): void;
    effectApplied(world: TlbWorld, effect: EffectComponent, bodyPart?: string): void;
    died(world: TlbWorld, entity: Entity): void;
    missed(world: TlbWorld, entity: Entity): void;
    attack(world: TlbWorld, source: Entity, target: Entity, attack: Attack): void;
}
export declare class LogResource implements TlbResource, Log {
    readonly kind: ResourceName;
    entries: string[];
    update({}: TlbWorld): void;
    render({}: Renderer): void;
    getEntries(offset: number, limit: number): string[];
    effectApplied(world: TlbWorld, effectComponent: EffectComponent, bodyPart?: string): void;
    text(text: string): void;
    attack(world: TlbWorld, source: Entity, target: Entity, attack: Attack): void;
    died(world: TlbWorld, entity: Entity): void;
    missed(world: TlbWorld, entity: Entity): void;
    getName(world: TlbWorld, entity: Entity): string;
    verbify(source: string, verb: string): string;
    owner(target: string): string;
}
