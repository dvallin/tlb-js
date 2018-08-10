import { Vector } from "@/geometry/Vector"
import { Size } from "@/geometry/Size"
import { Direction } from "@/geometry/Direction"

export class Vector2D extends Vector {

    public static from(facing: Direction): Vector2D {
        let x: number = 0
        let y: number = 0
        switch (facing) {
            case Direction.West:
                x = -1
                break
            case Direction.East:
                x = +1
        }
        switch (facing) {
            case Direction.North:
                y = -1
                break
            case Direction.South:
                y = +1
        }
        return new Vector2D(x, y)
    }

    public get x(): number {
        return this.coordinates[0]
    }

    public set x(value: number) {
        this.coordinates[0] = value
    }

    public get y(): number {
        return this.coordinates[1]
    }

    public set y(value: number) {
        this.coordinates[1] = value
    }

    public assign(position: Vector2D): void {
        this.x = position.x
        this.y = position.y
    }

    public get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    public add(position: Vector2D): Vector2D {
        return new Vector2D(this.x + position.x, this.y + position.y)
    }

    public subtract(position: Vector2D): Vector2D {
        return new Vector2D(this.x - position.x, this.y - position.y)
    }

    public mult(scalar: number): Vector2D {
        return new Vector2D(this.x * scalar, this.y * scalar)
    }

    public scale(resize: Size): Vector2D {
        return new Vector2D(this.x * resize.width, this.y * resize.height)
    }

    public normal(): Vector2D {
        return new Vector2D(-this.y, this.x)
    }

    public normalize(): Vector2D {
        const length = this.length
        if (length > 0) {
            return new Vector2D(this.x / length, this.y / length)
        } else {
            return new Vector2D(NaN, NaN)
        }
    }

    public fround(): Vector2D {
        return new Vector2D(
            Math.fround(this.x),
            Math.fround(this.y)
        )
    }
}
