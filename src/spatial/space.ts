import { Vector } from "./vector"

export interface Space<A> {
    get(pos: Vector): A | undefined
    set(pos: Vector, objects: A): void
    remove(pos: Vector): A | undefined
}

export class DiscreteSpace<A> implements Space<A> {

    private readonly objects: Map<string, A> = new Map()

    public get(pos: Vector): A | undefined {
        return this.objects.get(pos.key)
    }

    public set(pos: Vector, objects: A): void {
        this.objects.set(pos.key, objects)
    }

    public remove(pos: Vector): A | undefined {
        const key = pos.key
        const value = this.objects.get(key)
        this.objects.delete(key)
        return value
    }
}

export class SubSpace<A> implements Space<A> {

    public constructor(
        public readonly space: Space<A>,
        public readonly transform: (pos: Vector) => Vector
    ) { }

    public get(pos: Vector): A | undefined {
        return this.space.get(this.transform(pos))
    }

    public set(pos: Vector, objects: A): void {
        return this.space.set(this.transform(pos), objects)
    }

    public remove(pos: Vector): A | undefined {
        return this.space.remove(this.transform(pos))
    }
}
