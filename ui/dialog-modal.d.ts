import { Entity } from '../ecs/entity';
import { Vector } from '../spatial';
import { Renderer } from '../renderer/renderer';
import { UIElement } from './ui-element';
import { TlbWorld } from '../tlb';
import { WindowDecoration } from './window-decoration';
import { ItemSelector } from './selector';
import { Dialog, Result, Answer } from '../assets/dialogs';
import { Random } from '../random';
export declare class DialogModal implements UIElement {
    private readonly random;
    private readonly window;
    private readonly player;
    private readonly owner;
    closed: boolean;
    result: Answer | undefined;
    private dialogState;
    private currentText;
    private selectY;
    selector: ItemSelector<Result> | undefined;
    constructor(world: TlbWorld, random: Random, window: WindowDecoration, dialog: Dialog, player: Entity, owner: Entity);
    render(renderer: Renderer): void;
    update(world: TlbWorld): void;
    private navigate;
    private startDialog;
    private reset;
    contains(position: Vector): boolean;
}
