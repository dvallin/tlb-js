import { Vector } from "@/geometry/Vector"

export class Size extends Vector {
    constructor(
        width: number,
        height: number
    ) {
        super(width, height)
    }

    public get width(): number {
        return this.coordinates[0]
    }

    public get height(): number {
        return this.coordinates[1]
    }
}
