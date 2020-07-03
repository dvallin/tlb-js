import { Partitioner, Partition } from './Partitioner';
import { Random } from '../../random';
import { Shape } from '../../geometry/shape';
import { Vector } from '../../spatial';
import { SpacePartitioner } from '../space-partitioner';
export declare class NoSplit implements Partitioner {
    private readonly maxRoomWidth;
    constructor(maxRoomWidth: number);
    weight: number;
    canPartition(shape: Shape): boolean;
    partition(context: SpacePartitioner, _random: Random, shape: Shape, exits: Vector[]): Partition;
}
