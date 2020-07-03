import { Shape } from '../geometry/shape';
import { Distribution } from '../random/distributions';
import { Vector } from '../spatial';
import { Partitioner, Partition } from './partitioners/Partitioner';
export declare class SpacePartitioner {
    private random;
    private partitioners;
    constructor(rng: Distribution);
    registerPartitioner(partitioner: Partitioner): void;
    partition(shape: Shape, exits: Vector[]): Partition;
    createRoom(shape: Shape, exits: Vector[]): Partition;
    createCorridor(shape: Shape, exits: Vector[]): Partition;
    exitConnectsShape(shape: Shape, exit: Vector): boolean;
}
