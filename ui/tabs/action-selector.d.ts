import { Action, SelectedAction } from '../../components/action';
import { Renderer } from '../../renderer/renderer';
import { TlbWorld } from '../../tlb';
import { Rectangle } from '../../geometry/rectangle';
import { Selector, ItemSelector } from '../selector';
import { Tab, TabView, TabsKey } from '../tabs';
import { KeyboardCommand } from '../../resources/input';
export interface SelectableAction {
    action: Action;
    available: boolean;
}
export interface ActionGroup {
    entity: number;
    description: string;
    name: string;
    items: SelectableAction[];
}
export declare class ActionSelectorFullView implements TabView, Selector<SelectedAction> {
    readonly content: Rectangle;
    readonly groups: ActionGroup[];
    private readonly actions;
    private readonly descriptions;
    private selectedGroupIndex;
    readonly groupSelector: ItemSelector<ActionGroup>;
    actionSelector: ItemSelector<SelectableAction> | undefined;
    constructor(content: Rectangle, groups: ActionGroup[]);
    render(renderer: Renderer): void;
    readonly selected: SelectedAction | undefined;
    readonly hovered: SelectedAction | undefined;
    readonly length: number;
    update(world: TlbWorld): void;
    private renderActions;
    private renderGroup;
    private renderAction;
    private renderDescription;
}
export declare class ActionSelectorMinimizedView implements TabView {
    readonly content: Rectangle;
    readonly groups: ActionGroup[];
    constructor(content: Rectangle, groups: ActionGroup[]);
    update(_world: TlbWorld): void;
    render(renderer: Renderer): void;
}
export declare class ActionSelector implements Tab, Selector<SelectedAction> {
    readonly groups: ActionGroup[];
    readonly key: TabsKey;
    readonly name: string;
    readonly shortName: string;
    readonly command: KeyboardCommand;
    readonly minimizedHint: TabsKey;
    full: ActionSelectorFullView | undefined;
    minimized: ActionSelectorMinimizedView | undefined;
    constructor(groups: ActionGroup[]);
    setFull(content: Rectangle): void;
    setMinimized(content: Rectangle): void;
    readonly selected: SelectedAction | undefined;
    readonly hovered: SelectedAction | undefined;
    readonly length: number;
}
