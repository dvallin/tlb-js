import { Shape } from '../geometry/shape';
import { Vector } from './vector';
export interface StackedSpace<A> {
    get(pos: Vector): A[];
    set(pos: Vector, objects: A[]): void;
    add(pos: Vector, object: A): void;
    addAll(shape: Shape, object: A): void;
    retain(pos: Vector, predicate: (a: A) => boolean): void;
}
export declare class DiscreteStackedSpace<A> implements StackedSpace<A> {
    readonly width: number;
    private readonly objects;
    constructor(width: number);
    get(pos: Vector): A[];
    set(pos: Vector, objects: A[]): void;
    add(pos: Vector, object: A): void;
    addAll(shape: Shape, object: A): void;
    retain(pos: Vector, predicate: (a: A) => boolean): void;
}
