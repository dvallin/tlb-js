import { Rectangle } from '../geometry/rectangle';
import { NumericKeyboardCommand } from '../resources/input';
import { TlbWorld } from '../tlb';
import { Vector } from '../spatial';
import { Renderer } from '../renderer/renderer';
export declare class Button {
    private command;
    private position;
    clicked: boolean;
    hovered: boolean;
    text: string;
    bounds: Rectangle;
    constructor(command: NumericKeyboardCommand, position: Vector);
    setText(text: string): void;
    update(world: TlbWorld): void;
    render(renderer: Renderer): void;
}
