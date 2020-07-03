import { Vector } from './vector';
export declare class Line {
    readonly origin: Vector;
    readonly direction: Vector;
    constructor(origin: Vector, direction: Vector);
    side(point: Vector): 'left' | 'inside' | 'right';
}
