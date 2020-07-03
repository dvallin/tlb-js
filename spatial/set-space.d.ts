import { Vector } from './vector';
import { Shape } from '../geometry/shape';
export declare class SetSpace {
    readonly width: number;
    readonly objects: Uint8Array;
    constructor(width: number);
    has(pos: Vector): boolean;
    set(pos: Vector): void;
    byIndex(index: number): number;
    setAll(shape: Shape): void;
    remove(pos: Vector): boolean;
    clear(): void;
    add(space: SetSpace): void;
}
