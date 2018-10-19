
export interface Storage<T> {

    insert(entity: number, value: T): void
    get(entity: number): T | undefined
    remove(entity: number): T | undefined
    has(entity: number): boolean

    foreach(f: (entity: number, value: T) => void): void
    clear(): void
}

export class SetStorage implements Storage<{}> {

    private data: Set<number> = new Set()

    public insert(entity: number, { }: {}): void {
        this.data.add(entity)
    }

    public clear(): void {
        this.data.clear()
    }

    public get(entity: number): {} | undefined {
        return this.data.has(entity) ? {} : undefined
    }

    public remove(entity: number): {} | undefined {
        return this.data.delete(entity) ? {} : undefined
    }

    public has(entity: number): boolean {
        return this.data.has(entity)
    }

    public foreach(f: (entity: number, value: {}) => void): void {
        this.data.forEach(v => f(v, {}))
    }
}

export class MapStorage<T> implements Storage<T> {

    private data: Map<number, T> = new Map()

    public insert(entity: number, value: T): void {
        this.data.set(entity, value)
    }

    public clear(): void {
        this.data.clear()
    }

    public get(entity: number): T | undefined {
        return this.data.get(entity)
    }

    public remove(entity: number): T | undefined {
        const value = this.get(entity)
        this.data.delete(entity)
        return value
    }

    public has(entity: number): boolean {
        return this.data.has(entity)
    }

    public foreach(f: (entity: number, value: T) => void): void {
        this.data.forEach((value, entity) => f(entity, value))
    }
}

export class VectorStorage<T> implements Storage<T> {

    private data: (T | undefined)[] = []

    public insert(entity: number, value: T): void {
        this.data[entity] = value
    }

    public clear(): void {
        this.data = []
    }

    public get(entity: number): T | undefined {
        return this.data[entity]
    }

    public remove(entity: number): T | undefined {
        const value = this.get(entity)
        this.data[entity] = undefined
        return value
    }

    public has(entity: number): boolean {
        return this.data[entity] !== undefined
    }

    public foreach(f: (entity: number, value: T) => void): void {
        for (let entity = 0; entity < this.data.length; entity++) {
            const value = this.data[entity]
            if (value !== undefined) {
                f(entity, value)
            }
        }
    }
}
