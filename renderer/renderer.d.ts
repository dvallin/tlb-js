import { Display } from 'rot-js';
import { Position } from './position';
import { Color } from './color';
import { Viewport } from '../resources/viewport';
import { TlbWorld } from '../tlb';
import { Feature } from '../components/feature';
import { PositionComponent } from '../components/position';
import { Entity } from '../ecs/entity';
import { LightingComponent } from '../components/light';
import { Vector } from '../spatial';
export interface Renderer {
    render(world: TlbWorld): void;
    boundaries: Vector;
    clear(): void;
    eventToPosition(e: UIEvent): Position | undefined;
    character(character: string, position: Position, fg: Color, bg?: Color): void;
    text(text: string, position: Position, fg: Color, bg?: Color): void;
    flowText(text: string, position: Position, width: number, fg: Color, bg?: Color): number;
}
export declare class RotRenderer implements Renderer {
    readonly display: Display;
    ambientColor: Color;
    constructor(display: Display, ambientColor: Color);
    readonly boundaries: Vector;
    static createAndMount(root: HTMLElement, displayOptions?: {
        width: number;
        height: number;
        forceSquareRatio: boolean;
        fontSize: number;
        fontFamily: string;
        bg: string;
    }): RotRenderer;
    clear(): void;
    render(world: TlbWorld): void;
    renderEntity(world: TlbWorld, viewport: Viewport, entity: Entity, centered: boolean): void;
    renderFeature(world: TlbWorld, viewport: Viewport, entity: Entity, centered: boolean, feature: Feature, position: PositionComponent): void;
    computeColor(ambientLight: Color, diffuse: Color, lighting: LightingComponent | undefined): Color;
    eventToPosition(e: TouchEvent | MouseEvent): Position | undefined;
    character(character: string, position: Position, fg: Color, bg?: Color): void;
    text(text: string, position: Position, fg: Color, bg?: Color): void;
    flowText(text: string, position: Position, width: number, fg: Color, bg?: Color): number;
}
