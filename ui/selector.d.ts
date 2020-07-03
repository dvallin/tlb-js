import { TlbWorld } from '../tlb';
import { Rectangle } from '../geometry/rectangle';
export interface Selector<T> {
    hovered: T | undefined;
    selected: T | undefined;
    length: number;
}
export interface SelectorState {
    focused: boolean;
    firstRow: number;
    selected: number | undefined;
    hovered: number;
}
export declare class ItemSelector<T> implements Selector<T> {
    private items;
    private readonly state;
    constructor(items: T[], state?: SelectorState);
    setItems(items: T[]): void;
    readonly selected: T | undefined;
    readonly hovered: T | undefined;
    readonly selectedIndex: number | undefined;
    readonly hoveredIndex: number | undefined;
    readonly length: number;
    itemAtIndex(line: number): T | undefined;
    update(world: TlbWorld, content: Rectangle): void;
    isItemVisible(content: Rectangle, index: number): boolean;
}
export declare function updateSelectorState(world: TlbWorld, current: SelectorState, content: Rectangle, availableRows: number): void;
export declare function isLineVisible(current: SelectorState, content: Rectangle, index: number): boolean;
