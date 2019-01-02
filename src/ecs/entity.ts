import { World } from "./world"

export type Entity = number

export class EntityModifier<C, S, R> {

    public constructor(
        private readonly world: World<C, S, R>,
        public readonly entity: Entity
    ) { }

    public withComponent<T>(name: C, component: T): EntityModifier<C, S, R> {
        this.world.getStorage(name).insert(this.entity, component)
        return this
    }

    public removeComponent(name: C): EntityModifier<C, S, R> {
        this.world.getStorage(name).remove(this.entity)
        return this
    }

    public delete(): void {
        this.world.components.forEach(s => s.remove(this.entity))
    }
}
