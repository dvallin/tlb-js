export enum Direction {
    North = "North",
    West = "West",
    East = "East",
    South = "South"
}

export function leftOf(facing: Direction): Direction {
    switch (facing) {
        case Direction.North: return Direction.West
        case Direction.East: return Direction.North
        case Direction.South: return Direction.East
        case Direction.West: return Direction.South
    }
}

export function rightOf(facing: Direction): Direction {
    switch (facing) {
        case Direction.North: return Direction.East
        case Direction.East: return Direction.South
        case Direction.South: return Direction.West
        case Direction.West: return Direction.North
    }
}
