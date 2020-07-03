import { Partitioner, Partition } from './Partitioner';
import { SpacePartitioner } from '../space-partitioner';
import { Shape } from '../../geometry/shape';
import { Vector } from '../../spatial';
import { Random } from '../../random';
export declare class CorridorSplit implements Partitioner {
    private readonly corridorWidth;
    private readonly maxRoomWidth;
    constructor(corridorWidth: number, maxRoomWidth: number);
    weight: number;
    canPartition(shape: Shape, exits: Vector[]): boolean;
    partition(context: SpacePartitioner, random: Random, shape: Shape, exits: Vector[]): Partition;
    private split;
}
