import { Entity } from '../ecs/entity'

export type Ai = 'rushing'
export type AiState = 'idle' | 'engaging'
export interface AiComponent {
  type: Ai
  state: AiState

  interest: Entity | undefined
  distrust: number
  authorized: Set<Entity>
}
