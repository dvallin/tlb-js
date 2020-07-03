import { TlbWorld } from '../tlb';
import { Vector } from '../spatial';
import { Cover } from '../components/feature';
import { Direction } from '../spatial/direction';
export declare function coveringDirections(from: Vector, to: Vector): Direction[];
export declare function calculateCover(world: TlbWorld, level: number, from: Vector, to: Vector): Cover;
