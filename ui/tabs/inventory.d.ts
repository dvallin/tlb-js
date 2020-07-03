import { Renderer } from '../../renderer/renderer';
import { Entity } from '../../ecs/entity';
import { TlbWorld } from '../../tlb';
import { KeyboardCommand } from '../../resources/input';
import { Rectangle } from '../../geometry/rectangle';
import { InventoryDescription, ItemWithEntity } from '../../component-reducers/inventory-description';
import { ItemSelector } from '../selector';
import { Tab, TabView, TabsKey } from '../tabs';
import { Random } from '../../random';
import { TakeTurnComponent } from '../../components/rounds';
export interface State {
    focus: Entity;
    inventory?: InventoryDescription;
    takeTurn?: TakeTurnComponent;
}
export declare class FullInventoryView implements TabView {
    readonly content: Rectangle;
    readonly uniform: Random;
    private readonly state;
    private readonly items;
    private readonly descriptions;
    readonly itemSelector: ItemSelector<ItemWithEntity>;
    constructor(content: Rectangle, uniform: Random, focus: Entity);
    render(renderer: Renderer): void;
    renderInventory(renderer: Renderer, inventory: InventoryDescription, hovered: number | undefined): void;
    renderDescription(renderer: Renderer, inventory: InventoryDescription, index: number): void;
    update(world: TlbWorld): void;
    private use;
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
    readonly uniform: Random;
    readonly key: TabsKey;
    name: string;
    readonly shortName: string;
    readonly command: KeyboardCommand;
    readonly minimizedHint: TabsKey;
    full: FullInventoryView | undefined;
    minimized: MinimizedInventoryView | undefined;
    constructor(focus: Entity, uniform: Random);
    setFull(content: Rectangle): void;
    setMinimized(content: Rectangle): void;
}
