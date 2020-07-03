import { Action } from '../components/action';
import { ModAction } from '../components/items';
export declare function addModification(type: ModAction, base: Action): Action;
export declare type ActionType = 'endTurn' | 'move' | 'heal' | 'kill' | 'trigger' | 'hit' | 'kick' | 'rush' | 'shoot' | 'tighten' | 'bodyShield' | 'noMove' | 'changeEquipment';
export declare function createAction(type: ActionType): Action;
