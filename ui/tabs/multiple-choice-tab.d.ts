import { Renderer } from '../../renderer/renderer';
import { TlbWorld } from '../../tlb';
import { Rectangle } from '../../geometry/rectangle';
import { Selector, ItemSelector } from '../selector';
import { Tab, TabView, TabsKey } from '../tabs';
import { KeyboardCommand } from '../../resources/input';
import { Entity } from '../../ecs/entity';
import { MultipleChoiceOption } from '../multiple-choice-modal';
export declare class MultipleChoiceFullView implements TabView, Selector<Entity> {
    private readonly content;
    private readonly options;
    closed: boolean;
    readonly selector: ItemSelector<Entity>;
    constructor(content: Rectangle, options: MultipleChoiceOption[]);
    get selected(): Entity | undefined;
    get hovered(): Entity | undefined;
    get length(): number;
    render(renderer: Renderer): void;
    update(world: TlbWorld): void;
}
export declare class MultipleChoiceSelector implements Tab, Selector<Entity> {
    private readonly options;
    readonly key: TabsKey;
    readonly name: string;
    readonly shortName: string;
    readonly command: KeyboardCommand;
    readonly minimizedHint: TabsKey;
    full: MultipleChoiceFullView | undefined;
    minimized: MultipleChoiceFullView | undefined;
    constructor(options: MultipleChoiceOption[]);
    setFull(content: Rectangle): void;
    setMinimized(content: Rectangle): void;
    get selected(): Entity | undefined;
    get hovered(): Entity | undefined;
    get length(): number;
}
