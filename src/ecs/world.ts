import { Storage } from "./storage"
import { System } from "./system"
import { Resource } from "./resource"
import { Entity, EntityModifier } from "./entity"

export class World<C, R> {

    public readonly components: Map<C, Storage<object>> = new Map()
    public readonly resources: Map<R, Resource<C, R>> = new Map()
    public readonly systems: System<C, R>[] = []

    private openEntities: Set<Entity> = new Set()
    private lastEntity: Entity = -1

    public get entityCount(): number {
        return (this.lastEntity + 1) - this.openEntities.size
    }

    public registerComponentStorage<T extends object>(component: C, storage: Storage<T>): void {
        this.components.set(component, storage)
    }

    public getStorage<T extends object>(component: C): Storage<T> {
        return this.components.get(component)! as Storage<T>
    }

    public getResource<T extends Resource<C, R>>(resource: R): T {
        return this.resources.get(resource)! as T
    }

    public getComponent<T extends object>(entity: number, component: C): T | undefined {
        const storage = this.getStorage<T>(component)
        if (storage !== undefined) {
            return storage.get(entity)
        }
        return undefined
    }

    public hasComponent(entity: number, component: C): boolean {
        const storage = this.getStorage(component)
        if (storage !== undefined) {
            return storage.has(entity)
        }
        return false
    }

    public createEntity(): EntityModifier<C, R> {
        let entity
        if (this.openEntities.size > 0) {
            entity = this.openEntities.values().next().value
            this.openEntities.delete(entity)
        } else {
            entity = ++this.lastEntity
        }
        return new EntityModifier(this, entity)
    }

    public editEntity(entity: number): EntityModifier<C, R> {
        return new EntityModifier(this, entity)
    }

    public deleteEntity(entity: Entity): void {
        this.editEntity(entity).delete()
        this.openEntities.add(entity)
    }

    public registerSystem(system: System<C, R>): void {
        this.systems.push(system)
    }

    public registerResource(resource: Resource<C, R>): void {
        this.resources.set(resource.kind, resource)
    }

    public execute(): void {
        for (const resource of this.resources) {
            resource[1].update(this)
        }
        for (const system of this.systems) {
            const firstStorage = this.getStorage(system.components[0])
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
                }
            })
        }
    }
}
