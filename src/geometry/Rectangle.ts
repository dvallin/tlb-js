import { Position } from "@/components/Position"
import { Size } from "@/components/Size"
import { Direction } from "@/components/Direction"

export class Rectangle {
    public static from(position: Position, size: Size, facing?: Direction): Rectangle {
        if (facing === undefined) {
            return new Rectangle(position.x, position.x + size.width, position.y, position.y + size.height)
        }
        let left: number
        let right: number
        switch (facing) {
            case Direction.West:
                left = position.x - size.width
                right = position.x
                break
            case Direction.North:
            case Direction.South:
                const halfWidth = Math.floor(size.width / 2)
                left = position.x - halfWidth
                right = position.x + halfWidth
                break
            case Direction.East:
                left = position.x
                right = position.x + size.width
                break
        }
        let top: number
        let bottom: number
        switch (facing) {
            case Direction.North:
                top = position.y - size.height
                bottom = position.y
                break
            case Direction.West:
            case Direction.East:
                const halfHeight = Math.floor(size.height / 2)
                top = position.y - halfHeight
                bottom = position.y + halfHeight
                break
            case Direction.South:
                top = position.y
                bottom = position.y + size.height
                break
        }
        return new Rectangle(left!, right!, top!, bottom!)
    }

    public get mid(): Position {
        return new Position(Math.floor((this.left + this.right) / 2), Math.floor((this.top + this.bottom) / 2))
    }

    public get extend(): Size {
        return new Size(this.right - this.left, this.bottom - this.top)
    }

    private constructor(
        public left: number,
        public right: number,
        public top: number,
        public bottom: number,
    ) { }

    public grow(size: number): Rectangle {
        return new Rectangle(this.left - size, this.right + size, this.top - size, this.bottom + size)
    }

    public addDirection(facing: Direction): Position {
        let x: number
        let y: number
        switch (facing) {
            case Direction.West:
                x = this.left - 1
                break
            case Direction.North:
            case Direction.South:
                x = this.mid.x
                break
            case Direction.East:
                x = this.right + 1
        }
        switch (facing) {
            case Direction.North:
                y = this.top - 1
                break
            case Direction.West:
            case Direction.East:
                y = this.mid.y
                break
            case Direction.South:
                y = this.bottom + 1
        }
        return new Position(x!, y!)
    }
}
