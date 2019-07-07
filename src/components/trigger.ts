import { Entity } from '../ecs/entity'

export interface TriggersComponent {
  entities: Entity[]
}

export interface TriggeredByComponent {
  entity: Entity
}
