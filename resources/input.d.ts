import { TlbResource, ResourceName } from '../tlb';
import { Vector } from '../spatial';
import { Position } from '../renderer/position';
export interface Key {
    ctrl: boolean;
    meta: boolean;
    alt: boolean;
    key: string;
}
export declare const defaultKeyMapping: {
    [key in KeyboardCommand]: Key;
};
export declare type NumericKeyboardCommand = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export declare type OptionsKeyboardCommand = 'grid';
export declare type TabKeyboardCommand = 'inventory' | 'log' | 'focus' | 'overview';
export declare type UIInteractionKeyboardCommand = 'accept' | 'cancel';
export declare type PlayerInteractionKeyboardCommand = 'left' | 'down' | 'up' | 'right' | 'use' | 'plus' | 'minus';
export declare type KeyboardCommand = NumericKeyboardCommand | PlayerInteractionKeyboardCommand | UIInteractionKeyboardCommand | TabKeyboardCommand | OptionsKeyboardCommand;
export interface Input {
    position: Position | undefined;
    mouseDown: boolean;
    mousePressed: boolean;
    mouseReleased: boolean;
    numericActive(): NumericKeyboardCommand | undefined;
    isActive(key: KeyboardCommand): boolean;
    createMovementDelta(): Vector;
}
export declare class InputResource implements TlbResource, Input {
    readonly eventToPosition: (event: MouseEvent | TouchEvent) => Position | undefined;
    readonly kind: ResourceName;
    position: Position | undefined;
    mouseDown: boolean;
    mousePressed: boolean;
    mouseReleased: boolean;
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
    keyDown: Set<string>;
    keyPressed: Set<string>;
    keyReleased: Set<string>;
    private mouseEvent;
    private keyEvents;
    constructor(eventToPosition: (event: MouseEvent | TouchEvent) => Position | undefined);
    update(): void;
    isActive(command: KeyboardCommand): boolean;
    isDown(command: KeyboardCommand): boolean;
    numericActive(): NumericKeyboardCommand | undefined;
    createMovementDelta(): Vector;
    private handleMouseEvent;
    private handleKeyboardEvents;
}
