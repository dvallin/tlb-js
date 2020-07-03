import { TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
import { AiComponent } from '../components/ai';
import { State } from '../game-states/state';
export declare function engage(world: TlbWorld, entity: Entity, ai: AiComponent, pushState: (state: State) => void): void;
