import { Vector } from './vector';
import { Shape } from '../geometry/shape';
export interface Space<A> {
    get(pos: Vector): A | undefined;
    set(pos: Vector, object: A): void;
    setAll(shape: Shape, object: A): void;
    remove(pos: Vector): A | undefined;
}
export declare class DiscreteSpace<A> implements Space<A> {
    readonly width: number;
    private readonly objects;
    constructor(width: number);
    get(pos: Vector): A | undefined;
    set(pos: Vector, object: A): void;
    setAll(shape: Shape, object: A): void;
    remove(pos: Vector): A | undefined;
}
export declare class DiscreteStackSpace<A> implements Space<A> {
    readonly width: number;
    private readonly objects;
    constructor(width: number);
    get(pos: Vector): A | undefined;
    set(pos: Vector, object: A): void;
    setAll(shape: Shape, object: A): void;
    remove(pos: Vector): A | undefined;
}
