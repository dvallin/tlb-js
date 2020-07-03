import { SelectedAction } from './action';
import { Entity } from '../ecs/entity';
export interface SelectionState {
    selection?: SelectedAction;
    target?: Entity;
    skippedActions: number;
    currentSubAction: number;
}
export interface TakeTurnComponent {
    moved: boolean;
    acted: boolean;
    selectionState: SelectionState | undefined;
}
