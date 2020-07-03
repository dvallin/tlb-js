import { Entity } from '../ecs/entity';
import { Vector } from '../spatial';
import { Renderer } from '../renderer/renderer';
import { UIElement } from './ui-element';
import { TlbWorld } from '../tlb';
import { WindowDecoration } from './window-decoration';
import { InventoryDescription } from '../component-reducers/inventory-description';
export interface State {
    leftWindow: WindowDecoration;
    rightWindow: WindowDecoration;
    left: Entity;
    right: Entity;
    leftInventory?: InventoryDescription;
    rightInventory?: InventoryDescription;
    leftActive: boolean;
    hovered: number;
}
export declare class InventoryTransferModal implements UIElement {
    private readonly state;
    closed: boolean;
    constructor(state: State);
    render(renderer: Renderer): void;
    renderInventory(renderer: Renderer, window: WindowDecoration, inventory: InventoryDescription, active: boolean, hovered: number | undefined): void;
    update(world: TlbWorld): void;
    transfer(source: InventoryDescription, target: InventoryDescription, index: number): void;
    contains(position: Vector): boolean;
}
