import { Shape, AbstractShape } from './shape';
import { Rectangle } from './rectangle';
import { Vector } from '../spatial/vector';
export declare class Union extends AbstractShape {
    readonly shape1: Shape;
    readonly shape2: Shape;
    constructor(shape1: Shape, shape2: Shape);
    static of(...shapes: Shape[]): Shape;
    bounds(): Rectangle;
    containsVector(p: Vector): boolean;
    grow(cells?: number): Union;
    shrink(cells?: number): Union;
    translate(t: Vector): Union;
    all(f: (p: Vector) => boolean): boolean;
}
