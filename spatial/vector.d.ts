import { Direction } from './direction';
export declare class Vector {
    static fromDirection(direction: Direction): Vector;
    static interpolate(a: Vector, b: Vector, alpha: number): Vector;
    readonly coordinates: [number, number];
    constructor(coords: [number, number]);
    get key(): string;
    index(width: number): number;
    get center(): Vector;
    get x(): number;
    get fX(): number;
    get y(): number;
    get fY(): number;
    equals(other: Vector): boolean;
    add(other: Vector): Vector;
    minus(other: Vector): Vector;
    mult(scale: number): Vector;
    abs(): Vector;
    bounds(other: Vector): boolean;
    perpendicular(): Vector;
    squaredLength(): number;
    length(): number;
    l1(): number;
    lN(): number;
    normalize(): Vector;
    isNan(): boolean;
}
