import { Distribution } from './distributions';
import { Rectangle } from '../geometry/rectangle';
import { Vector } from '../spatial';
export declare class Random {
    readonly distribution: Distribution;
    constructor(distribution: Distribution);
    floatBetween(minInclusive: number, maxExclusive: number): number;
    integerBetween(minInclusive: number, maxInclusive: number): number;
    decision(probability: number): boolean;
    weightedDecision(weights: number[]): number;
    pickN<T>(array: T[], n?: number): T[];
    pick<T>(array: T[]): T;
    pickIndex<T>(array: T[]): number;
    shuffle<T>(array: T[]): void;
    insideRectangle(rectangle: Rectangle): Vector;
    betweenVectors(a: Vector, b: Vector): Vector;
}
