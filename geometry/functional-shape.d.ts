import { AbstractShape } from './shape';
import { Vector } from '../spatial';
import { Rectangle } from './rectangle';
export declare class FunctionalShape extends AbstractShape {
    private readonly f;
    private readonly boundary;
    static lN(position: Vector, size?: number, center?: boolean): FunctionalShape;
    static l1(position: Vector, size?: number, center?: boolean): FunctionalShape;
    static empty(position: Vector): FunctionalShape;
    static l2(position: Vector, size?: number, center?: boolean): FunctionalShape;
    static fromMeasure(position: Vector, size: number, center: boolean, measure: (d: Vector) => boolean): FunctionalShape;
    constructor(f: (p: Vector) => boolean, boundary: Rectangle);
    bounds(): Rectangle;
    containsVector(p: Vector): boolean;
    translate(t: Vector): FunctionalShape;
    grow(): FunctionalShape;
    shrink(): FunctionalShape;
    all(f: (position: Vector) => boolean): boolean;
}
