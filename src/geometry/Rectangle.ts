import { Position } from "@/geometry/Position"
import { Size } from "@/geometry/Size"
import { Direction } from "@/geometry/Direction"

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

    public add(position: Position): Rectangle {
        return new Rectangle(this.left + position.x, this.right + position.x, this.top + position.y, this.bottom + position.y)
    }

    public isInside(position: Position): boolean {
        return position.x >= this.left && position.x <= this.right && position.y >= this.top && position.y < this.bottom
    }

    public clamp(size: Size): Rectangle {
        let result = new Rectangle(this.left, this.right, this.top, this.bottom)
        if (this.left < 0) {
            result = result.add(new Position(-this.left, 0))
        }
        if (this.right > size.width - 1) {
            result = result.add(new Position(size.width - this.right, 0))
        }
        if (this.top < 0) {
            result = result.add(new Position(0, -this.top))
        }
        if (this.bottom > size.height - 1) {
            result = result.add(new Position(0, size.height - 1 - this.bottom))
        }
        return result
    }
}
