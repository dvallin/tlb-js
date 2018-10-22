import { World } from "./world"

export interface Resource<C, R> {

    kind: R
    update(world: World<C, R>): void
}
