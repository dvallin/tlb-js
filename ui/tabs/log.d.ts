import { Renderer } from '../../renderer/renderer';
import { TlbWorld } from '../../tlb';
import { WindowDecoration } from '../window-decoration';
import { Rectangle } from '../../geometry/rectangle';
import { Tab, TabView, TabsKey } from '../tabs';
import { KeyboardCommand } from '../../resources/input';
export interface State {
    window: WindowDecoration;
    entries: string[];
}
export declare class LogView implements TabView {
    readonly content: Rectangle;
    private entries;
    constructor(content: Rectangle);
    render(renderer: Renderer): void;
    update(world: TlbWorld): void;
}
export declare class LogTab implements Tab {
    readonly key: TabsKey;
    readonly name: string;
    readonly shortName: string;
    readonly command: KeyboardCommand;
    readonly minimizedHint: TabsKey;
    full: LogView | undefined;
    minimized: LogView | undefined;
    setFull(content: Rectangle): void;
    setMinimized(content: Rectangle): void;
}
