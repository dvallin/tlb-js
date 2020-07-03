import { Shape, AbstractShape } from './shape';
import { Rectangle } from './rectangle';
import { Vector } from '../spatial/vector';
export declare class Difference extends AbstractShape {
    readonly baseShape: Shape;
    readonly subtractionShape: Shape;
    static innerBorder(shape: Shape): Difference;
    constructor(baseShape: Shape, subtractionShape: Shape);
    bounds(): Rectangle;
    containsVector(p: Vector): boolean;
    grow(cells?: number): Difference;
    shrink(cells?: number): Difference;
    translate(t: Vector): Difference;
    all(f: (p: Vector) => boolean): boolean;
}
