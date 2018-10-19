import { Direction } from "@/spatial/direction"

export class Vector {

    public static fromDirection(direction: Direction): Vector {
        switch (direction) {
            case "up": return new Vector(0, -1)
            case "right": return new Vector(1, 0)
            case "down": return new Vector(0, 1)
            case "left": return new Vector(-1, 0)
        }
    }

    private readonly coordinates: number[]

    public constructor(...coords: number[]) {
        this.coordinates = coords
    }

    public get key(): string {
        return this.coordinates.join()
    }

    public get dimensions(): number {
        return this.coordinates.length
    }

    public get x(): number {
        return this.coordinates[0]
    }

    public get y(): number {
        return this.coordinates[1]
    }

    public get z(): number {
        return this.coordinates[2]
    }

    public at(index: number): number {
        return this.coordinates[index]
    }

    public add(other: Vector): Vector {
        const result = []
        for (let i = 0; i < this.dimensions; i++) {
            result.push(this.at(i) + other.at(i))
        }
        return new Vector(...result)
    }

    public mult(scale: number): Vector {
        const result = []
        for (let i = 0; i < this.dimensions; i++) {
            result.push(this.at(i) * scale)
        }
        return new Vector(...result)
    }

    public abs(): Vector {
        const result = []
        for (let i = 0; i < this.dimensions; i++) {
            result.push(Math.abs(this.at(i)))
        }
        return new Vector(...result)
    }

    public bounds(other: Vector): boolean {
        for (let i = 0; i < this.dimensions; i++) {
            if (Math.abs(other.at(i)) >= Math.abs(this.at(i))) {
                return false
            }
        }
        return true
    }

    public perpendicular(): Vector {
        return new Vector(-this.y, this.x)
    }
}
