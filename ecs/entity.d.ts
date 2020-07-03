import { World } from './world';
export declare type Entity = number;
export declare class EntityModifier<C, S, R> {
    private readonly world;
    readonly entity: Entity;
    constructor(world: World<C, S, R>, entity: Entity);
    withComponent<T extends object>(name: C, component: T): EntityModifier<C, S, R>;
    removeComponent(name: C): EntityModifier<C, S, R>;
    delete(): void;
}
