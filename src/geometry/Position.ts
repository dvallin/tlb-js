import { Direction } from "@/geometry/Direction"
import { Vector } from "@/geometry/Vector"

export enum Domain {
    Tower
}

export class Position {

    public static from(facing: Direction, level: number, domain: Domain): Position {
        const pos = Vector.create2dVector(facing)
        pos.z = level
        return new Position(domain, pos)
    }

    constructor(
        public domain: Domain,
        public pos: Vector
    ) { }

    public get x(): number {
        return this.pos.x
    }

    public set x(value: number) {
        this.pos.x = value
    }

    public get y(): number {
        return this.pos.y
    }

    public set y(value: number) {
        this.pos.y = value
    }

    public get z(): number {
        return this.pos.z
    }

    public set z(value: number) {
        this.pos.z = value
    }

    public index(): string {
        return this.domain.toString() + "," + this.pos.index()
    }

    public inside(boundary: Vector): boolean {
        return this.pos.inside(boundary)
    }

    public subtract(vector: Vector): Position {
        return new Position(this.domain, this.pos.subtract(vector))
    }

    public add(vector: Vector): Position {
        return new Position(this.domain, this.pos.add(vector))
    }
}
