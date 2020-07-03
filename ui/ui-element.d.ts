import { Vector } from '../spatial';
import { Renderer } from '../renderer/renderer';
import { TlbWorld } from '../tlb';
export interface UIElement {
    render(renderer: Renderer): void;
    update(world: TlbWorld): void;
    contains(position: Vector): boolean;
}
