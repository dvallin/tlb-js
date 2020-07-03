import { Entity } from '../ecs/entity';
import { Distribution } from '../random/distributions';
import { ComponentName, TlbSystem, TlbWorld } from '../tlb';
export declare class RegionCreator implements TlbSystem {
    readonly components: ComponentName[];
    private readonly uniform;
    private readonly exponential;
    constructor(rng: Distribution);
    update(world: TlbWorld, entity: Entity): void;
    private fillStructure;
    private buildStructure;
    private canSplit;
    private canCorridorSplit;
    private canRoomSplit;
    private corridorSplit;
    private roomSplit;
    private split2;
    private split3;
    private renderCorridors;
    private renderRooms;
    private renderRoom;
    private findPossibleDoors;
    private createConnections;
}
