import { Shape } from "./shape"
import { Vector } from "../spatial"

export class Rectangle implements Shape {

    public static fromBounds(left: number, right: number, top: number, bottom: number): Rectangle {
        return new Rectangle(left, top, right - left + 1, bottom - top + 1)
    }

    public constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly width: number,
        public readonly height: number,
    ) { }

    public get left(): number {
        return this.x
    }

    public get right(): number {
        return this.x + this.width - 1
    }

    public get top(): number {
        return this.y
    }

    public get bottom(): number {
        return this.y + this.height - 1
    }

    public get topLeft(): Vector {
        return new Vector(this.left, this.top)
    }

    public get bottomRight(): Vector {
        return new Vector(this.right, this.bottom)
    }

    public bounds(): Rectangle {
        return this
    }

    public contains(p: Vector): boolean {
        return p.x >= this.x && p.x < this.x + this.width
            && p.y >= this.y && p.y < this.y + this.height
    }

    public plus(other: Rectangle): Rectangle {
        return Rectangle.fromBounds(
            Math.min(this.left, other.left), Math.max(this.right, other.right),
            Math.min(this.top, other.top), Math.max(this.bottom, other.bottom)
        )
    }

    public foreach(f: (position: Vector) => void): void {
        this.takeWhile(p => {
            f(p)
            return true
        })
    }

    public takeWhile(f: (position: Vector) => boolean): boolean {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const position = new Vector(j + this.x, i + this.y)
                if (!f(position)) {
                    return false
                }
            }
        }
        return true
    }
}
