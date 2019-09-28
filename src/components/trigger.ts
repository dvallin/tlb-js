import { Entity } from '../ecs/entity'

export interface TriggersComponent {
  name: string
  entities: Entity[]
}

export interface TriggeredByComponent {
  entity: Entity
}
