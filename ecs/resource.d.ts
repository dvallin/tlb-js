import { World } from './world';
export interface Resource<C, S, R> {
    kind: R;
    update(world: World<C, S, R>): void;
}
