import { Renderer } from '../../renderer/renderer';
import { TlbWorld } from '../../tlb';
import { Rectangle } from '../../geometry/rectangle';
import { Selector } from '../selector';
import { Tab, TabView, TabsKey } from '../tabs';
import { KeyboardCommand } from '../../resources/input';
import { Path } from '../../renderer/astar';
import { Queries } from '../../renderer/queries';
import { Entity } from '../../ecs/entity';
export declare class AttackSelectorFullView implements TabView, Selector<Path> {
    readonly content: Rectangle;
    private target;
    private readonly queries;
    private readonly range;
    private isSelected;
    private path;
    constructor(content: Rectangle, target: Entity, queries: Queries, range: number);
    render(_renderer: Renderer): void;
    get selected(): Path | undefined;
    get hovered(): Path | undefined;
    get length(): number;
    update(world: TlbWorld): void;
}
export declare class AttackSelector implements Tab, Selector<Path> {
    private target;
    private readonly queries;
    private readonly range;
    readonly key: TabsKey;
    readonly name: string;
    readonly shortName: string;
    readonly command: KeyboardCommand;
    readonly minimizedHint: TabsKey;
    full: AttackSelectorFullView | undefined;
    minimized: AttackSelectorFullView | undefined;
    constructor(target: Entity, queries: Queries, range: number);
    setFull(content: Rectangle): void;
    setMinimized(content: Rectangle): void;
    get selected(): Path | undefined;
    get hovered(): Path | undefined;
    get length(): number;
}
