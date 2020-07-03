import { Action, SelectedAction } from '../../components/action';
import { Renderer } from '../../renderer/renderer';
import { TlbWorld } from '../../tlb';
import { Rectangle } from '../../geometry/rectangle';
import { Selector, ItemSelector } from '../selector';
import { Tab, TabView, TabsKey } from '../tabs';
import { KeyboardCommand } from '../../resources/input';
export interface SelectableAction {
    owner?: string;
    entity: number;
    action: Action;
}
export declare class ActionSelectorFullView implements TabView, Selector<SelectedAction> {
    readonly content: Rectangle;
    readonly selectableActions: SelectableAction[];
    private readonly actions;
    private readonly descriptions;
    readonly selector: ItemSelector<SelectableAction>;
    constructor(content: Rectangle, selectableActions: SelectableAction[]);
    render(renderer: Renderer): void;
    get selected(): SelectedAction | undefined;
    get hovered(): SelectedAction | undefined;
    get length(): number;
    update(world: TlbWorld): void;
    private renderActions;
    private renderDescription;
}
export declare class ActionSelectorMinimizedView implements TabView {
    readonly content: Rectangle;
    readonly actions: SelectableAction[];
    constructor(content: Rectangle, actions: SelectableAction[]);
    update(_world: TlbWorld): void;
    render(renderer: Renderer): void;
}
export declare class ActionSelector implements Tab, Selector<SelectedAction> {
    readonly actions: SelectableAction[];
    readonly key: TabsKey;
    readonly name: string;
    readonly shortName: string;
    readonly command: KeyboardCommand;
    readonly minimizedHint: TabsKey;
    full: ActionSelectorFullView | undefined;
    minimized: ActionSelectorMinimizedView | undefined;
    constructor(actions: SelectableAction[]);
    setFull(content: Rectangle): void;
    setMinimized(content: Rectangle): void;
    get selected(): SelectedAction | undefined;
    get hovered(): SelectedAction | undefined;
    get length(): number;
}
