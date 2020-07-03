import { World } from './ecs/world';
import { System } from './ecs/system';
import { Resource } from './ecs/resource';
import { Uniform } from './random/distributions';
import { Renderer } from './renderer/renderer';
import { Queries } from './renderer/queries';
import { State } from './game-states/state';
export declare type ComponentName = 'active' | 'age' | 'ai' | 'asset' | 'character-stats' | 'character-type' | 'dead' | 'dialog' | 'effect' | 'equiped-items' | 'feature' | 'fov' | 'free-mode-anchor' | 'ground' | 'inventory' | 'item' | 'lore' | 'npc' | 'overlay' | 'player' | 'position' | 'region' | 'quest' | 'structure' | 'script' | 'active-effects' | 'spawn' | 'start-turn' | 'take-turn' | 'took-turn' | 'triggered-by' | 'triggers' | 'viewport-focus' | 'wait-turn';
export declare type SystemName = 'ai-round-control' | 'start-round' | 'fov' | 'free-mode-control' | 'info-popup' | 'npc' | 'player-control' | 'player-interaction' | 'player-round-control' | 'region-builder' | 'script' | 'trigger';
export declare type ResourceName = 'input' | 'map' | 'viewport' | 'ui' | 'log' | 'progress';
export declare type TlbWorld = World<ComponentName, SystemName, ResourceName>;
export declare type TlbResource = Resource<ComponentName, SystemName, ResourceName>;
export declare type TlbSystem = System<ComponentName, SystemName, ResourceName>;
export declare type PushState = (s: State) => void;
export declare function registerComponents<S, R>(world: World<ComponentName, S, R>): void;
export declare function registerResources(world: World<ComponentName, SystemName, ResourceName>, uniform: Uniform, renderer: Renderer, worldWidth?: number): void;
export declare function registerSystems(world: World<ComponentName, SystemName, ResourceName>, uniform: Uniform, queries: Queries, pushState: PushState): void;