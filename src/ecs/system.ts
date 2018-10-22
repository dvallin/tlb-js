import { World } from "./world"

export interface System<C, R> {

    readonly components: C[]
    update(world: World<C, R>, entity: number): void
}
