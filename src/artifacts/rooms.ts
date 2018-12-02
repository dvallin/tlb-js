import { Shape } from "../geometry/shape"
import { Rectangle } from "../geometry/rectangle"

import { Direction } from "../spatial/direction"
import { Vector } from "../spatial"
import { Union } from "../geometry/union"

export interface Entry {
    position: Vector
    direction: Direction
}

export interface Room {
    shape: Shape
    entries: Shape[]
    availableEntries: Entry[]
}

export const rectangular: Room = {
    shape: new Rectangle(0, 0, 7, 7),
    entries: [],
    availableEntries: [
        { position: new Vector(3, -1), direction: "down" },
        { position: new Vector(-1, 3), direction: "right" },
        { position: new Vector(7, 3), direction: "left" },
        { position: new Vector(4, 7), direction: "up" }
    ]
}

export const largeRectangular: Room = {
    shape: new Rectangle(0, 0, 14, 14),
    entries: [],
    availableEntries: [
        { position: new Vector(3, -1), direction: "down" },
        { position: new Vector(7, -1), direction: "down" },
        { position: new Vector(11, -1), direction: "down" },
        { position: new Vector(-1, 3), direction: "right" },
        { position: new Vector(14, 3), direction: "left" },
        { position: new Vector(-1, 7), direction: "right" },
        { position: new Vector(14, 7), direction: "left" },
        { position: new Vector(-1, 11), direction: "right" },
        { position: new Vector(14, 11), direction: "left" },
        { position: new Vector(3, 14), direction: "up" },
        { position: new Vector(7, 14), direction: "up" },
        { position: new Vector(11, 14), direction: "up" },
    ]
}

export const lShaped: Room = {
    shape: new Union(
        new Rectangle(0, 0, 14, 7),
        new Rectangle(0, 7, 7, 7),
    ),
    entries: [],
    availableEntries: [
        { position: new Vector(3, -1), direction: "down" },
        { position: new Vector(7, -1), direction: "down" },
        { position: new Vector(11, -1), direction: "down" },
        { position: new Vector(-1, 3), direction: "right" },
        { position: new Vector(14, 3), direction: "left" },
        { position: new Vector(-1, 7), direction: "right" },
        { position: new Vector(11, 7), direction: "up" },
        { position: new Vector(-1, 11), direction: "right" },
        { position: new Vector(7, 6), direction: "left" },
        { position: new Vector(3, 14), direction: "up" },
    ]
}