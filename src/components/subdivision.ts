import { Rectangle } from "../geometry/rectangle"
import { Entity } from "../ecs/entity"

export interface SubdivisionComponent {

    rectangle: Rectangle
    children: Entity[]
}
