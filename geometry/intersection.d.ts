import { Shape, AbstractShape } from './shape';
import { Rectangle } from './rectangle';
import { Vector } from '../spatial/vector';
export declare class Intersection extends AbstractShape {
    readonly a: Shape;
    readonly b: Shape;
    constructor(a: Shape, b: Shape);
    bounds(): Rectangle;
    containsVector(p: Vector): boolean;
    grow(cells?: number): Intersection;
    shrink(cells?: number): Intersection;
    translate(t: Vector): Intersection;
    all(f: (p: Vector) => boolean): boolean;
}
