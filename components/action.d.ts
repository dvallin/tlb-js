import { Effect } from './effects';
import { CharacterType } from '../assets/characters';
import { AttackResult } from '../component-reducers/attack-target';
export declare type Cost = 'action' | 'movement' | 'all' | 'both' | 'either';
export interface Movement {
    kind: 'movement';
    target: 'self';
    range: number;
}
export interface Jump {
    kind: 'jump';
    target: 'self';
    range: number;
}
export interface ChangeEquipment {
    kind: 'changeEquipment';
}
export interface Trigger {
    kind: 'trigger';
}
export interface Attack {
    kind: 'attack';
    target: 'enemy';
    effects: Effect[];
    range: number;
    accuracy: number;
    grants?: (result: AttackResult) => SubAction[];
}
export interface Status {
    kind: 'status';
    target: 'self' | 'item';
    effects: Effect[];
}
export declare type SubAction = Movement | Attack | Status | ChangeEquipment | Trigger | Jump;
export interface Action {
    name: string;
    cost: Cost;
    subActions: SubAction[];
    characterTypes?: CharacterType[];
    cooldown?: number;
}
export declare function action(name: string, cost: Cost, subActions: SubAction[], characterTypes?: CharacterType[]): Action;
export interface SelectedAction {
    entity: number;
    action: Action;
}
