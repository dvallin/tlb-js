import { Entity } from './entity'

export interface Storage<T> {
  insert(entity: Entity, value: T): void
  get(entity: Entity): T | undefined
  remove(entity: Entity): T | undefined
  has(entity: Entity): boolean

  foreach(f: (entity: Entity, value: T) => void): void
  clear(): void
  size(): number
}

export class SetStorage implements Storage<{}> {
  private data: Set<number> = new Set()

  public size(): number {
    return this.data.size
  }

  public insert(entity: Entity, {  }: {}): void {
    this.data.add(entity)
  }

  public clear(): void {
    this.data.clear()
  }

  public get(entity: Entity): {} | undefined {
    return this.data.has(entity) ? {} : undefined
  }

  public remove(entity: Entity): {} | undefined {
    return this.data.delete(entity) ? {} : undefined
  }

  public has(entity: Entity): boolean {
    return this.data.has(entity)
  }

  public foreach(f: (entity: Entity, value: {}) => void): void {
    this.data.forEach(v => f(v, {}))
  }
}

export class SingletonStorage<T> implements Storage<T> {
  private datum: number | undefined = undefined
  private value: T | undefined = undefined

  public size(): number {
    return this.datum !== undefined ? 1 : 0
  }

  public insert(entity: Entity, value: T): void {
    this.datum = entity
    this.value = value
  }

  public clear(): void {
    this.datum = undefined
  }

  public get(entity: Entity): T | undefined {
    return this.datum === entity ? this.value : undefined
  }

  public remove(entity: Entity): T | undefined {
    if (this.datum === entity) {
      this.datum = undefined
      return this.value
    }
    return undefined
  }

  public has(entity: Entity): boolean {
    return this.datum === entity
  }

  public foreach(f: (entity: Entity, value: T) => void): void {
    if (this.datum !== undefined) {
      f(this.datum, this.value!)
    }
  }
}

export class MapStorage<T> implements Storage<T> {
  private data: Map<number, T> = new Map()

  public size(): number {
    return this.data.size
  }

  public insert(entity: Entity, value: T): void {
    this.data.set(entity, value)
  }

  public clear(): void {
    this.data.clear()
  }

  public get(entity: Entity): T | undefined {
    return this.data.get(entity)
  }

  public remove(entity: Entity): T | undefined {
    const value = this.get(entity)
    this.data.delete(entity)
    return value
  }

  public has(entity: Entity): boolean {
    return this.data.has(entity)
  }

  public foreach(f: (entity: Entity, value: T) => void): void {
    this.data.forEach((value, entity) => f(entity, value))
  }
}

export class VectorStorage<T> implements Storage<T> {
  private data: (T | undefined)[] = []
  private count: number = 0

  public size(): number {
    return this.count
  }

  public insert(entity: Entity, value: T): void {
    if (this.data[entity] === undefined) {
      this.count++
    }
    this.data[entity] = value
  }

  public clear(): void {
    this.data = []
  }

  public get(entity: Entity): T | undefined {
    return this.data[entity]
  }

  public remove(entity: Entity): T | undefined {
    if (this.data[entity] !== undefined) {
      this.count--
    }
    const value = this.get(entity)
    this.data[entity] = undefined
    return value
  }

  public has(entity: Entity): boolean {
    return this.data[entity] !== undefined
  }

  public foreach(f: (entity: Entity, value: T) => void): void {
    for (let entity = 0; entity < this.data.length; entity++) {
      const value = this.data[entity]
      if (value !== undefined) {
        f(entity, value)
      }
    }
  }
}
