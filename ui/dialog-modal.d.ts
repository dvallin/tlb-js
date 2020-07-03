import { Entity } from '../ecs/entity';
import { Vector } from '../spatial';
import { Renderer } from '../renderer/renderer';
import { UIElement } from './ui-element';
import { TlbWorld } from '../tlb';
import { WindowDecoration } from './window-decoration';
import { ItemSelector } from './selector';
import { Dialog, Answer, AnswerType } from '../assets/dialogs';
import { Random } from '../random';
export interface State {
}
export declare class DialogModal implements UIElement {
    private readonly random;
    private readonly window;
    private readonly dialog;
    private readonly player;
    private readonly npc;
    closed: boolean;
    result: AnswerType | undefined;
    private currentText;
    private currentAnswers;
    private selectY;
    selector: ItemSelector<Answer> | undefined;
    constructor(world: TlbWorld, random: Random, window: WindowDecoration, dialog: Dialog, player: Entity, npc: Entity);
    render(renderer: Renderer): void;
    update(world: TlbWorld): void;
    private select;
    contains(position: Vector): boolean;
}
