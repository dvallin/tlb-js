import { Shape } from '../../geometry/shape';
import { Vector } from '../../spatial';
import { Random } from '../../random';
import { SpacePartitioner } from '../space-partitioner';
import { Entity } from '../../ecs/entity';
export interface PartitionBase {
    shape: Shape;
}
export declare type Partition = PartitionBase & (Final | Node);
export interface Final {
    type: 'final';
    kind: 'corridor' | 'room' | 'hub';
    exits: Vector[];
    entity?: Entity;
}
export interface Edge {
    from: number;
    to: number;
}
export interface Node {
    type: 'node';
    exit: number;
    partitions: Partition[];
    connections: Edge[];
}
export interface Partitioner {
    weight: number;
    canPartition(shape: Shape, exits: Vector[]): boolean;
    partition(context: SpacePartitioner, random: Random, shape: Shape, exits: Vector[]): Partition;
}
