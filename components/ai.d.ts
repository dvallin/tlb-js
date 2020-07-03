import { Entity } from '../ecs/entity';
export declare type Ai = 'rushing';
export declare type AiState = 'idle' | 'engaging';
export interface AiComponent {
    type: Ai;
    state: AiState;
    interest: Entity | undefined;
    distrust: number;
}
