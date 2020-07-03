import { Vector } from './vector';
export declare class Line {
    origin: Vector;
    direction: Vector;
    constructor(origin: Vector, direction: Vector);
    side(point: Vector): 'left' | 'inside' | 'right';
    isEqual(line: Line): boolean;
}
