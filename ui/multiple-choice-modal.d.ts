import { Entity } from '../ecs/entity';
import { Vector } from '../spatial';
import { Renderer } from '../renderer/renderer';
import { UIElement } from './ui-element';
import { TlbWorld } from '../tlb';
import { WindowDecoration } from './window-decoration';
import { ItemSelector } from './selector';
export interface MultipleChoiceOption {
    entity: Entity | number;
    description: string;
}
export declare class MultipleChoiceModal implements UIElement {
    private readonly window;
    private readonly options;
    closed: boolean;
    readonly selector: ItemSelector<{
        entity: Entity;
        description: string;
    }>;
    constructor(window: WindowDecoration, options: MultipleChoiceOption[]);
    render(renderer: Renderer): void;
    update(world: TlbWorld): void;
    contains(position: Vector): boolean;
}
