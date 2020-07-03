import { Renderer } from '../../renderer/renderer';
import { Entity } from '../../ecs/entity';
import { TlbWorld } from '../../tlb';
import { CharacterStatsComponent } from '../../components/character-stats';
import { TakeTurnComponent } from '../../components/rounds';
import { LightingComponent } from '../../components/light';
import { KeyboardCommand } from '../../resources/input';
import { Rectangle } from '../../geometry/rectangle';
import { FeatureProvider } from '../../components/feature';
import { ActiveEffectsComponent } from '../../components/effects';
import { Tab, TabView, TabsKey } from '../tabs';
export interface State {
    focus: Entity;
    stats?: CharacterStatsComponent;
    activeEffects?: ActiveEffectsComponent;
    takeTurn?: TakeTurnComponent;
    enemies: {
        feature?: FeatureProvider;
    }[];
    lighting?: LightingComponent;
}
export declare class OverviewView implements TabView {
    readonly content: Rectangle;
    private readonly state;
    constructor(content: Rectangle, focus: Entity);
    render(renderer: Renderer): void;
    update(world: TlbWorld): void;
}
export declare class Overview implements Tab {
    readonly focus: Entity;
    readonly key: TabsKey;
    readonly name: string;
    readonly shortName: string;
    readonly command: KeyboardCommand;
    readonly minimizedHint: TabsKey;
    full: OverviewView | undefined;
    minimized: OverviewView | undefined;
    constructor(focus: Entity);
    setFull(content: Rectangle): void;
    setMinimized(content: Rectangle): void;
}
