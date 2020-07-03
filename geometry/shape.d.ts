import { Vector } from '../spatial/vector';
import { Rectangle } from './rectangle';
export interface Shape {
    bounds(): Rectangle;
    containsVector(p: Vector): boolean;
    contains(s: Shape): boolean;
    intersects(s: Shape): boolean;
    equals(s: Shape): boolean;
    foreach(f: (p: Vector, i: number) => void): void;
    all(f: (p: Vector) => boolean): boolean;
    some(predicate: (p: Vector) => boolean): boolean;
    translate(t: Vector): Shape;
    grow(cells?: number): Shape;
    shrink(cells?: number): Shape;
}
export declare abstract class AbstractShape implements Shape {
    abstract bounds(): Rectangle;
    abstract containsVector(p: Vector): boolean;
    abstract all(f: (p: Vector) => boolean): boolean;
    abstract translate(t: Vector): Shape;
    abstract grow(cells?: number): Shape;
    abstract shrink(cells?: number): Shape;
    contains(s: Shape): boolean;
    intersects(s: Shape): boolean;
    equals(s: Shape): boolean;
    foreach(f: (position: Vector, i: number) => void): void;
    some(f: (position: Vector) => boolean): boolean;
}
