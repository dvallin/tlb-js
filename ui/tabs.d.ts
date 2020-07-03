import { UIElement } from './ui-element';
import { Renderer } from '../renderer/renderer';
import { Vector } from '../spatial';
import { TlbWorld } from '../tlb';
import { Rectangle } from '../geometry/rectangle';
import { KeyboardCommand } from '../resources/input';
export interface TabView {
    render(renderer: Renderer): void;
    update(world: TlbWorld): void;
}
export declare type TabsKey = 'actionSelector' | 'movementSelector' | 'attackSelector' | 'inventory' | 'log' | 'overview';
export interface Tab {
    key: TabsKey;
    name: string;
    shortName: string;
    command: KeyboardCommand;
    minimized?: TabView;
    full?: TabView;
    minimizedHint?: TabsKey;
    setFull(content: Rectangle): void;
    setMinimized(content: Rectangle): void;
}
export declare class Tabs implements UIElement {
    private mainTab;
    private minimizedTab;
    private readonly mainTabWindow;
    private readonly minimizedTabWindow;
    private readonly tabs;
    private focusTab;
    constructor(mainWindow: Rectangle, minimizedWindow: Rectangle);
    add(tab: Tab): void;
    setFocusTab(tab: Tab): void;
    reset(): void;
    render(renderer: Renderer): void;
    update(world: TlbWorld): void;
    contains(position: Vector): boolean;
    private setTab;
}
