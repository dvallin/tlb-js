import { Renderer } from '../../renderer/renderer';
import { Entity } from '../../ecs/entity';
import { TlbWorld } from '../../tlb';
import { KeyboardCommand } from '../../resources/input';
import { Rectangle } from '../../geometry/rectangle';
import { InventoryDescription } from '../../component-reducers/inventory-description';
import { ItemSelector } from '../selector';
import { Item } from '../../components/items';
import { Tab, TabView, TabsKey } from '../tabs';
export interface State {
    focus: Entity;
    inventory?: InventoryDescription;
}
export declare class FullInventoryView implements TabView {
    readonly content: Rectangle;
    private readonly state;
    private selectedItemIndex;
    readonly itemSelector: ItemSelector<Item>;
    private readonly button;
    constructor(content: Rectangle, focus: Entity);
    render(renderer: Renderer): void;
    renderInventory(renderer: Renderer, inventory: InventoryDescription, hovered: number | undefined): void;
    renderDescription(renderer: Renderer, inventory: InventoryDescription, index: number): void;
    update(world: TlbWorld): void;
    private equip;
}
export declare class MinimizedInventoryView implements TabView {
    readonly content: Rectangle;
    private readonly state;
    private readonly inventoryContent;
    constructor(content: Rectangle, focus: Entity);
    render(renderer: Renderer): void;
    renderInventory(renderer: Renderer, content: Rectangle, inventory: InventoryDescription): void;
    update(world: TlbWorld): void;
}
export declare class Inventory implements Tab {
    readonly focus: Entity;
    readonly key: TabsKey;
    name: string;
    readonly shortName: string;
    readonly command: KeyboardCommand;
    readonly minimizedHint: TabsKey;
    full: FullInventoryView | undefined;
    minimized: MinimizedInventoryView | undefined;
    constructor(focus: Entity);
    setFull(content: Rectangle): void;
    setMinimized(content: Rectangle): void;
}
