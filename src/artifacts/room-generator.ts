import { Random } from "../random"
import { Shape } from "../geometry/shape"
import { Vector } from "../spatial"
import { Direction, perDirection } from "../spatial/direction"
import { Rectangle } from "../geometry/rectangle"
import { Union } from "../geometry/union"

export interface Entry {
    shape: Shape
    direction: Direction
}

export interface Room {
    shape: Shape
    entries: Entry[]
}

export class RoomGenerator {

    public constructor(
        public readonly random: Random
    ) { }

    public generate(doorShape: Rectangle, entryDirection: Direction): Room {
        let room: Room | undefined
        if (this.random.decision(0.0)) {
            let tries = 4
            while (room === undefined && tries > 0) {
                tries--
                room = this.lshapedRoom(doorShape, entryDirection)
            }
        }
        if (room !== undefined) {
            return room
        }
        return this.rectangularRoom(doorShape, entryDirection)
    }

    public rectangularRoom(doorShape: Rectangle, direction: Direction): Room {
        const width = this.random.integerBetween(5, 10)
        const height = this.random.integerBetween(5, 10)
        const shape = new Rectangle(0, 0, width, height)
        const doorPivot = doorShape.topLeft.add(Vector.fromDirection(direction))

        const alpha = [1 / 6, 1 / 2, 5 / 6][this.random.weightedDecision([2, 3, 2])]
        const translatedShape = this.translateToEntry(shape, doorPivot, direction, alpha)

        const entries = [
            { shape: doorShape, direction }
        ]
        const exit = this.findExit(translatedShape, doorPivot, direction)
        if (exit) {
            entries.push(
                { shape: new Rectangle(exit.x, exit.y, 1, 1), direction }
            )
        }
        return {
            shape: translatedShape, entries
        }
    }

    public lshapedRoom(doorShape: Rectangle, direction: Direction): Room | undefined {
        const a = this.random.integerBetween(5, 10)
        const b = this.random.integerBetween(7, 14)
        const shape1 = new Rectangle(0, 0, a, b)
        let shape2 = new Rectangle(0, 0, b, a)
        let align: Vector
        switch (this.random.integerBetween(0, 3)) {
            case 1:
                align = shape1.topRight.minus(shape2.topRight)
                break
            case 2:
                align = shape1.bottomRight.minus(shape2.bottomRight)
                break
            case 3:
                align = shape1.bottomLeft.minus(shape2.bottomLeft)
                break
            case 0:
            default:
                align = new Vector(0, 0)
        }
        shape2 = shape2.translate(align)

        const shape = new Union(shape1, shape2)
        const entryShape = doorShape.translate(Vector.fromDirection(direction))
        const entryPivot = entryShape.topLeft

        const alphas = [1 / 3, 1 / 2, 2 / 3]
        this.random.shuffle(alphas)

        for (const alpha of alphas) {
            const translatedShape = this.translateToEntry(shape, entryPivot, direction, alpha)
            if (translatedShape.contains(entryShape)) {
                return {
                    shape: translatedShape,
                    entries: [{ shape: doorShape, direction }]
                }
            }
        }
        return undefined
    }

    private translateToEntry(shape: Shape, pivot: Vector, direction: Direction, alpha: number): Shape {
        const bound = shape.bounds()
        const entry = perDirection(direction,
            () => Vector.interpolate(bound.bottomLeft, bound.bottomRight, alpha),
            () => Vector.interpolate(bound.bottomLeft, bound.topLeft, alpha),
            () => Vector.interpolate(bound.topRight, bound.topLeft, alpha),
            () => Vector.interpolate(bound.topRight, bound.bottomRight, alpha)
        ).floor()
        const translation = pivot.minus(entry)
        return shape.translate(translation)
    }

    private findExit(shape: Shape, entry: Vector, direction: Direction): Vector | undefined {
        const delta = Vector.fromDirection(direction)
        let inside = shape.containsVector(entry)
        let position = entry
        let turns = 0
        while (true) {
            position = position.add(delta)

            const newInside = shape.containsVector(position)
            if (inside && !newInside) {
                return position
            }
            inside = newInside

            if (turns > Math.max(shape.bounds().height, shape.bounds().width) + 2) {
                return undefined
            }
            turns++
        }
    }
}
