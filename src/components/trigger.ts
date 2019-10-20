import { Entity } from '../ecs/entity'

export interface TriggersComponent {
  type: 'asset' | 'dialog'
  name: string
  entities: Entity[]
}

export interface TriggeredByComponent {
  entity: Entity
}
