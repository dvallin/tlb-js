import { Direction } from "../spatial/direction"

export type Action = "render" | "move" | "changeDirection" | "close" | "createRoom"

export interface TunnellerComponent {

    actions: Action[]

    direction: Direction
    width: number
}
