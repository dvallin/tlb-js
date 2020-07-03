import { Vector, Space } from '../spatial';
import { Entity } from '../ecs/entity';
import { ResourceName, TlbResource, TlbWorld } from '../tlb';
import { FeatureComponent } from '../components/feature';
import { Shape } from '../geometry/shape';
import { SetSpace } from '../spatial/set-space';
import { Rectangle } from '../geometry/rectangle';
export declare class Level {
    readonly boundary: Rectangle;
    readonly tiles: Space<Entity>;
    readonly characters: Space<Entity>;
    readonly structures: Space<Entity>;
    visible: SetSpace;
    readonly discovered: SetSpace;
    constructor(width: number);
    setTile(position: Vector, entity: Entity): void;
    getTile(position: Vector): Entity | undefined;
    removeTile(position: Vector): Entity | undefined;
    setStructure(position: Vector, entity: Entity): void;
    getStructure(position: Vector): Entity | undefined;
    setCharacter(position: Vector, entity: Entity): void;
    getCharacter(position: Vector): Entity | undefined;
    removeCharacter(position: Vector): Entity | undefined;
    isDiscovered(position: Vector): boolean;
    isVisible(position: Vector): boolean;
    blocksJump(world: TlbWorld, position: Vector): boolean;
    isBlocking(world: TlbWorld, position: Vector, self?: Entity | undefined): boolean;
    isLightBlocking(world: TlbWorld, position: Vector): boolean;
    tileMatches(world: TlbWorld, position: Vector, predicate: (f: FeatureComponent | undefined) => boolean): boolean;
    characterMatches(world: TlbWorld, position: Vector, predicate: (f: FeatureComponent | undefined) => boolean, self?: Entity | undefined): boolean;
    featureMatches(world: TlbWorld, entity: Entity | undefined, predicate: (f: FeatureComponent | undefined) => boolean): boolean;
    isShapeFree(world: TlbWorld, shape: Shape): boolean;
    isShapeBlocked(world: TlbWorld, shape: Shape): boolean;
    shapeHasAll(world: TlbWorld, shape: Shape, predicate: (f: FeatureComponent | undefined) => boolean): boolean;
    shapeHasSome(world: TlbWorld, shape: Shape, predicate: (f: FeatureComponent | undefined) => boolean): boolean;
}
export interface WorldMap {
    levels: Level[];
}
export declare class WorldMapResource implements TlbResource, WorldMap {
    readonly width: number;
    readonly kind: ResourceName;
    readonly levels: Level[];
    constructor(width: number);
    update(world: TlbWorld): void;
}
