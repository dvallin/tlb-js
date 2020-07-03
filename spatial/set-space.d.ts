import { Vector } from './vector';
import { Shape } from '../geometry/shape';
export interface SetSpace {
    has(pos: Vector): boolean;
    set(pos: Vector): void;
    setAll(shape: Shape): void;
    remove(pos: Vector): boolean;
}
export declare class DiscreteSetSpace implements SetSpace {
    readonly width: number;
    private readonly objects;
    constructor(width: number);
    has(pos: Vector): boolean;
    set(pos: Vector): void;
    setAll(shape: Shape): void;
    remove(pos: Vector): boolean;
}
