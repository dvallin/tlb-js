export type Ai = 'rushing'
export type AiState = 'idle' | 'engaging'
export interface AiComponent {
  type: Ai
  state: AiState
}
