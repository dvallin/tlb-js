import { Direction } from "@/geometry/Direction"
import { Vector } from "@/geometry/Vector"
import { Vector2D } from "@/geometry/Vector2D"

export enum Domain {
    Tower
}

export class Position {

    public static from(facing: Direction, domain: Domain): Position {
        return new Position(domain, Vector2D.from(facing))
    }

    constructor(
        public domain: Domain,
        public pos: Vector
    ) { }

    public get x(): number {
        return this.pos.coordinates[0]
    }

    public set x(value: number) {
        this.pos.coordinates[0] = value
    }

    public get y(): number {
        return this.pos.coordinates[1]
    }

    public set y(value: number) {
        this.pos.coordinates[1] = value
    }

    public index(): string {
        let index = this.domain.toString()
        for (const coordinate of this.pos.coordinates) {
            index += "," + Math.round(coordinate).toFixed(0)
        }
        return index
    }

    public inside(boundary: Vector): boolean {
        if (this.pos.coordinates.length !== boundary.coordinates.length) {
            return false
        }
        for (let i = 0; i < this.pos.coordinates.length; ++i) {
            if (this.pos.coordinates[i] < 0 || this.pos.coordinates[i] >= boundary.coordinates[i]) {
                return false
            }
        }
        return true
    }

    public subtract(vector: Vector2D): Position {
        return new Position(this.domain, this.toVector2D().subtract(vector))
    }

    public add(vector: Vector2D): Position {
        return new Position(this.domain, this.toVector2D().add(vector))
    }

    public toVector2D(): Vector2D {
        return new Vector2D(this.pos.coordinates[0], this.pos.coordinates[1])
    }
}
