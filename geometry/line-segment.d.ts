import { AbstractShape } from './shape';
import { Vector } from '../spatial';
import { Rectangle } from './rectangle';
export declare class LineSegment extends AbstractShape {
    readonly from: Vector;
    readonly to: Vector;
    constructor(from: Vector, to: Vector);
    readonly direction: Vector;
    bounds(): Rectangle;
    translate(t: Vector): LineSegment;
    containsVector(p: Vector): boolean;
    grow(cells?: number): LineSegment;
    shrink(cells?: number): LineSegment;
    all(f: (p: Vector) => boolean): boolean;
}
