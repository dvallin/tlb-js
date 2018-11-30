import { Direction } from "../spatial/direction"

export type Action = "render" | "changeDirection" | "close" | "createRoom" | "move"

export interface TunnellerComponent {

    actions: Action[]

    direction: Direction
    width: number
    generation: number
}
