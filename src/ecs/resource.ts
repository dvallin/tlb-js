import { World } from "@/ecs/world"

export interface Resource<C, R> {

    kind: R
    update(world: World<C, R>): void
}
