import { Movement, Jump } from '../../components/action';
import { Renderer } from '../../renderer/renderer';
import { TlbWorld } from '../../tlb';
import { Rectangle } from '../../geometry/rectangle';
import { Selector } from '../selector';
import { Tab, TabView, TabsKey } from '../tabs';
import { KeyboardCommand } from '../../resources/input';
import { Path } from '../../renderer/astar';
import { Queries } from '../../renderer/queries';
import { Entity } from '../../ecs/entity';
export declare class MovementSelectorFullView implements TabView, Selector<Path> {
    readonly content: Rectangle;
    private target;
    private readonly queries;
    private readonly movement;
    private isSelected;
    private path;
    private targetFeature;
    constructor(content: Rectangle, target: Entity, queries: Queries, movement: Movement | Jump);
    render(renderer: Renderer): void;
    get selected(): Path | undefined;
    get hovered(): Path | undefined;
    get length(): number;
    update(world: TlbWorld): void;
}
export declare class MovementSelector implements Tab, Selector<Path> {
    private target;
    private readonly queries;
    private readonly movement;
    readonly key: TabsKey;
    readonly name: string;
    readonly shortName: string;
    readonly command: KeyboardCommand;
    readonly minimizedHint: TabsKey;
    full: MovementSelectorFullView | undefined;
    minimized: MovementSelectorFullView | undefined;
    constructor(target: Entity, queries: Queries, movement: Movement | Jump);
    setFull(content: Rectangle): void;
    setMinimized(content: Rectangle): void;
    get selected(): Path | undefined;
    get hovered(): Path | undefined;
    get length(): number;
}
