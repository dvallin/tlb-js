import { Partitioner, Partition } from './Partitioner';
import { SpacePartitioner } from '../space-partitioner';
import { Shape } from '../../geometry/shape';
import { Axis } from '../../spatial/axis';
import { Vector } from '../../spatial';
import { Rectangle } from '../../geometry/rectangle';
import { Random } from '../../random';
export declare class RoomSplit implements Partitioner {
    private readonly minRoomWidth;
    constructor(minRoomWidth: number);
    weight: number;
    canPartition(shape: Shape, exits: Vector[]): boolean;
    partition(context: SpacePartitioner, random: Random, shape: Shape, exits: Vector[]): Partition;
    split(r: Rectangle, axis: Axis, split: number): [Rectangle, Rectangle];
}
