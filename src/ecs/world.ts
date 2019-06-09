import { Storage } from './storage'
import { System } from './system'
import { Resource } from './resource'
import { Entity, EntityModifier } from './entity'

export class World<C, S, R> {
  public readonly components: Map<C, Storage<object>> = new Map()
  public readonly resources: Map<R, Resource<C, S, R>> = new Map()
  public readonly systems: Map<S, System<C, S, R>> = new Map()
  public readonly emptySystems: Set<S> = new Set()
  public readonly activeSystems: Set<S> = new Set()

  private openEntities: Set<Entity> = new Set()
  private lastEntity: Entity = -1

  public get entityCount(): number {
    return this.lastEntity + 1 - this.openEntities.size
  }

  public registerComponentStorage<T extends object>(component: C, storage: Storage<T>): void {
    this.components.set(component, storage)
  }

  public getStorage<T extends object>(component: C): Storage<T> {
    return this.components.get(component)! as Storage<T>
  }

  public getResource<T extends Resource<C, S, R>>(resource: R): T {
    return this.resources.get(resource)! as T
  }

  public getComponent<T extends object>(entity: Entity, component: C): T | undefined {
    const storage = this.getStorage<T>(component)
    if (storage !== undefined) {
      return storage.get(entity)
    }
    return undefined
  }

  public hasEntity(entity: Entity): boolean {
    return entity <= this.lastEntity && !this.openEntities.has(entity)
  }

  public hasComponent(entity: Entity, component: C): boolean {
    const storage = this.getStorage(component)
    if (storage !== undefined) {
      return storage.has(entity)
    }
    return false
  }

  public createEntity(): EntityModifier<C, S, R> {
    let entity
    if (this.openEntities.size > 0) {
      entity = this.openEntities.values().next().value
      this.openEntities.delete(entity)
    } else {
      entity = ++this.lastEntity
    }
    return new EntityModifier(this, entity)
  }

  public editEntity(entity: Entity): EntityModifier<C, S, R> {
    return new EntityModifier(this, entity)
  }

  public deleteEntity(entity: Entity): void {
    this.editEntity(entity).delete()
    this.openEntities.add(entity)
  }

  public registerSystem(name: S, system: System<C, S, R>): void {
    this.systems.set(name, system)
  }

  public enableSystem(name: S): void {
    this.activeSystems.add(name)
  }

  public disableSystem(name: S): void {
    this.activeSystems.delete(name)
  }

  public activeSystemsList(): S[] {
    const l: S[] = []
    this.activeSystems.forEach(s => l.push(s))
    return l
  }

  public registerResource(resource: Resource<C, S, R>): void {
    this.resources.set(resource.kind, resource)
  }

  public updateResources(): void {
    for (const resource of this.resources) {
      resource[1].update(this)
    }
  }

  public updateSystems(): void {
    this.emptySystems.clear()
    for (const name of this.activeSystems) {
      const system = this.systems.get(name)!
      const firstStorage = this.getStorage(system.components[0])
      let calls = 0
      firstStorage.foreach((entity: Entity) => {
        let callSystem = true
        for (let i = 1; i < system.components.length; i++) {
          if (!this.hasComponent(entity, system.components[i])) {
            callSystem = false
            break
          }
        }
        if (callSystem) {
          system.update(this, entity)
          calls++
        }
      })
      if (calls === 0) {
        this.emptySystems.add(name)
      }
    }
  }
}
