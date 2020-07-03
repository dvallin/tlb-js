import { Vector } from '../spatial';
import { Position } from '../renderer/position';
import { TlbWorld, ResourceName, TlbResource } from '../tlb';
import { Entity } from '../ecs/entity';
export interface Renderable {
    entity: Entity | undefined;
    opaque: boolean;
    centered: boolean;
}
export interface Viewport {
    fromDisplay(p: Position): Vector;
    collectRenderables(world: TlbWorld): Renderable[];
    toDisplay(p: Vector, centered: boolean): Position;
    focus(level: number, position: Vector): void;
    addLayer(layer: Layer): void;
    gridLocked: boolean;
    boundaries: Vector;
    level: number;
}
export interface Layer {
    getRenderable: (world: TlbWorld, layer: number, position: Vector) => Renderable;
    transformed: boolean;
}
export declare class ViewportResource implements TlbResource, Viewport {
    readonly boundaries: Vector;
    readonly kind: ResourceName;
    gridLocked: boolean;
    topLeft: Vector;
    level: number;
    readonly layers: Layer[];
    constructor(boundaries: Vector);
    update(world: TlbWorld): void;
    collectRenderables(world: TlbWorld): Renderable[];
    addLayer(layer: Layer): void;
    fromDisplay(p: Position): Vector;
    toDisplay(p: Vector, centered: boolean): Position;
    focus(level: number, position: Vector): void;
}
