import { Entity } from '../ecs/entity'

export interface ParentComponent {
  entity: Entity
}
export interface ChildrenComponent {
  children: Entity[]
}
