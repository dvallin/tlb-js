import { Direction } from "../spatial/direction"

export type Action = "render" | "move" | "changeDirection" | "close"

export interface TunnellerComponent {

    actions: Action[]

    direction: Direction
    width: number
}
