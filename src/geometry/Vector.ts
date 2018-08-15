import { Direction } from "@/geometry/Direction"

export class Vector {

    public static create2dVector(facing: Direction): Vector {
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
        return new Vector([x, y])
    }

    public static normal2d(v: Vector): Vector {
        return new Vector([-v.y, v.x])
    }

    public constructor(private readonly coordinates: number[]) {
    }

    public get dimension(): number {
        return this.coordinates.length
    }

    public at(index: number): number {
        return this.coordinates[index]
    }

    public get x(): number {
        return this.coordinates[0]
    }

    public set x(value: number) {
        this.coordinates[0] = value
    }

    public get width(): number {
        return this.coordinates[0]
    }

    public get y(): number {
        return this.coordinates[1]
    }

    public set y(value: number) {
        this.coordinates[1] = value
    }

    public get height(): number {
        return this.coordinates[1]
    }

    public get z(): number {
        return this.coordinates[2]
    }

    public set z(value: number) {
        this.coordinates[2] = value
    }

    public fold(position: Vector, mapping: (a: number | undefined, b: number | undefined) => number): Vector {
        const out = []
        for (let i = 0; i < Math.max(this.coordinates.length, position.coordinates.length); i++) {
            out.push(mapping(this.coordinates[i], position.coordinates[i]))
        }
        return new Vector(out)
    }

    public add(position: Vector): Vector {
        return this.fold(position, (a, b) => (a === undefined ? 0 : a) + (b === undefined ? 0 : b))
    }

    public scale(resize: Vector): Vector {
        return this.fold(resize, (a, b) => (a === undefined ? 0 : a) * (b === undefined ? 0 : b))
    }

    public subtract(position: Vector): Vector {
        return this.fold(position, (a, b) => (a === undefined ? 0 : a) - (b === undefined ? 0 : b))
    }

    public mult(scalar: number): Vector {
        return new Vector(this.coordinates.map(a => a * scalar))
    }

    public get squaredLength(): number {
        let v = 0
        for (const value of this.coordinates) {
            v += value * value
        }
        return v
    }

    public get length(): number {
        return Math.sqrt(this.squaredLength)
    }

    public normalize(): Vector | undefined {
        const length = this.length
        if (length > 0) {
            return new Vector(this.coordinates.map(a => a / length))
        } else {
            return undefined
        }
    }

    public index(): string {
        let index = ""
        for (const coordinate of this.coordinates) {
            index += "," + Math.floor(coordinate).toFixed(0)
        }
        return index
    }

    public inside(boundary: Vector): boolean {
        for (let i = 0; i < boundary.dimension; ++i) {
            if (this.coordinates[i] < 0 || this.coordinates[i] >= boundary.coordinates[i]) {
                return false
            }
        }
        return true
    }

    public fround(): Vector {
        return new Vector(this.coordinates.map(a => Math.fround(a)))
    }

}
