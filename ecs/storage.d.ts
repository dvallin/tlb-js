import { Entity } from './entity';
export interface Storage<T> {
    insert(entity: Entity, value: T): void;
    get(entity: Entity): T | undefined;
    remove(entity: Entity): T | undefined;
    has(entity: Entity): boolean;
    foreach(f: (entity: Entity, value: T) => void): void;
    first(): Entity | undefined;
    clear(): void;
    size(): number;
}
export declare class SetStorage implements Storage<{}> {
    private data;
    size(): number;
    insert(entity: Entity, _: {}): void;
    clear(): void;
    get(entity: Entity): {} | undefined;
    remove(entity: Entity): {} | undefined;
    has(entity: Entity): boolean;
    foreach(f: (entity: Entity, value: {}) => void): void;
    first(): Entity | undefined;
}
export declare class SingletonStorage<T> implements Storage<T> {
    private datum;
    private value;
    size(): number;
    insert(entity: Entity, value: T): void;
    clear(): void;
    get(entity: Entity): T | undefined;
    remove(entity: Entity): T | undefined;
    has(entity: Entity): boolean;
    foreach(f: (entity: Entity, value: T) => void): void;
    first(): Entity | undefined;
}
export declare class MapStorage<T> implements Storage<T> {
    private data;
    size(): number;
    insert(entity: Entity, value: T): void;
    clear(): void;
    get(entity: Entity): T | undefined;
    remove(entity: Entity): T | undefined;
    has(entity: Entity): boolean;
    foreach(f: (entity: Entity, value: T) => void): void;
    first(): Entity | undefined;
}
export declare class VectorStorage<T> implements Storage<T> {
    private data;
    private count;
    size(): number;
    insert(entity: Entity, value: T): void;
    clear(): void;
    get(entity: Entity): T | undefined;
    remove(entity: Entity): T | undefined;
    has(entity: Entity): boolean;
    foreach(f: (entity: Entity, value: T) => void): void;
    first(): Entity | undefined;
}
