import { Color } from '../renderer/color';
import { Entity } from '../ecs/entity';
import { WorldMap } from '../resources/world-map';
import { TlbWorld } from '../tlb';
import { Vector } from '../spatial';
export interface LightComponent {
    color: Color;
}
export interface LightingComponent {
    incomingLightInFrame: Map<Entity, Color>;
    incomingLight: Map<Entity, Color>;
}
export declare function createLight(world: TlbWorld, map: WorldMap, level: number, position: Vector, color: Color): void;
export declare function getLighting(world: TlbWorld, entity: Entity): LightingComponent;
