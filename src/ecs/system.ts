import { World } from "./world"

export interface System<C, S, R> {

    readonly components: C[]
    update(world: World<C, S, R>, entity: number): void
}
