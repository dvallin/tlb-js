import { Rectangle } from '../geometry/rectangle';
import { Renderer } from '../renderer/renderer';
import { Input } from '../resources/input';
import { Vector } from '../spatial';
export declare class WindowDecoration {
    private rectangle;
    title: string;
    bottomCollapse: boolean;
    constructor(rectangle: Rectangle, title: string, bottomCollapse?: boolean);
    get topLeft(): Vector;
    get right(): number;
    get bottom(): number;
    get content(): Rectangle;
    containsVector(vector: Vector): boolean;
    get width(): number;
    render(renderer: Renderer): void;
    update(_input: Input): void;
}
