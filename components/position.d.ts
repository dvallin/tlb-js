import { Vector } from '../spatial';
export interface PositionComponent {
    level: number;
    position: Vector;
}
export declare function centeredPosition(level: number, position: Vector): PositionComponent;
