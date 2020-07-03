import { Vector } from '../spatial';
import { Shape } from '../geometry/shape';
export interface Path {
    path: Vector[];
    cost: number;
}
export declare function astar(from: Vector, to: Vector, cost: (v: Vector, w: Vector) => number | undefined, neighbourhood: (target: Vector) => Shape, heuristic: (v: Vector) => number, maximumCost: number, bestEffort?: boolean): Path | undefined;
