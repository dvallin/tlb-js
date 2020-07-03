import { Vector } from '../spatial';
import { Shape } from '../geometry/shape';
export declare function bfs(width: number, origin: Vector, neighbourhood: (target: Vector) => Shape, visit: (target: Vector, depth: number) => boolean, canVisit: (target: Vector, depth: number) => boolean): void;
