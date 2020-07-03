import { Partitioner, Partition } from './Partitioner';
import { Random } from '../../random';
import { Shape } from '../../geometry/shape';
import { Vector } from '../../spatial';
import { SpacePartitioner } from '../space-partitioner';
export declare class KnossosMaze implements Partitioner {
    weight: number;
    canPartition(_shape: Shape): boolean;
    partition(context: SpacePartitioner, _random: Random, shape: Shape, exits: Vector[]): Partition;
}
