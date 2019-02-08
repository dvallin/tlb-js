import { World } from './ecs/world'
import { VectorStorage, MapStorage, SetStorage, SingletonStorage } from './ecs/storage'
import { System } from './ecs/system'
import { Resource } from './ecs/resource'

import { AgentComponent } from './components/agent'
import { AssetComponent } from './components/asset'
import { FeatureComponent } from './components/feature'
import { GroundComponent } from './components/ground'
import { ParentComponent, ChildrenComponent } from './components/relation'
import { PositionComponent } from './components/position'
import { AgeComponent } from './components/age'
import { RegionComponent } from './components/region'

import { Agent } from './systems/agent'

import { WorldMapResource } from './resources/world-map'
import { ViewportResource } from './resources/viewport'

import { Random } from './random'
import { Uniform } from './random/distributions'

import { InputResource } from './resources/input'
import { FreeModeControl } from './systems/free-mode-control'
import { RegionCreator } from './systems/region-creator'
import { PlayerControl } from './systems/player-control'
import { Renderer } from './renderer/renderer'
import { Trigger } from './systems/trigger'
import { PlayerInteraction } from './systems/player-interaction'
import { FovComponent } from './components/fov'
import { Fov } from './systems/fov'
import { Npc } from './systems/npc'
import { RayCaster } from './renderer/ray-caster'
import { Light } from './systems/light'
import { LightingComponent, LightComponent } from './components/light'
import { State } from './game-states/state'

export type ComponentName =
  | 'active'
  | 'age'
  | 'agent'
  | 'asset'
  | 'children'
  | 'feature'
  | 'fov'
  | 'free-mode-anchor'
  | 'ground'
  | 'in-viewport-character'
  | 'in-viewport-tile'
  | 'light'
  | 'lighting'
  | 'npc'
  | 'parent'
  | 'player'
  | 'position'
  | 'region'
  | 'spawn'
  | 'trigger'
  | 'viewport-focus'
export type SystemName =
  | 'agent'
  | 'fov'
  | 'free-mode-control'
  | 'light'
  | 'npc'
  | 'player-control'
  | 'player-interaction'
  | 'region-creator'
  | 'trigger'
export type ResourceName = 'input' | 'map' | 'viewport'

export type TlbWorld = World<ComponentName, SystemName, ResourceName>
export type TlbResource = Resource<ComponentName, SystemName, ResourceName>
export type TlbSystem = System<ComponentName, SystemName, ResourceName>

export function registerComponents<S, R>(world: World<ComponentName, S, R>): void {
  world.registerComponentStorage('active', new SetStorage())
  world.registerComponentStorage('age', new MapStorage<AgeComponent>())
  world.registerComponentStorage('agent', new MapStorage<AgentComponent>())
  world.registerComponentStorage('asset', new MapStorage<AssetComponent>())
  world.registerComponentStorage('children', new MapStorage<ChildrenComponent>())
  world.registerComponentStorage('feature', new VectorStorage<FeatureComponent>())
  world.registerComponentStorage('fov', new MapStorage<FovComponent>())
  world.registerComponentStorage('free-mode-anchor', new SingletonStorage())
  world.registerComponentStorage('ground', new MapStorage<GroundComponent>())
  world.registerComponentStorage('in-viewport-character', new SetStorage())
  world.registerComponentStorage('in-viewport-tile', new SetStorage())
  world.registerComponentStorage('light', new MapStorage<LightComponent>())
  world.registerComponentStorage('lighting', new VectorStorage<LightingComponent>())
  world.registerComponentStorage('parent', new MapStorage<ParentComponent>())
  world.registerComponentStorage('player', new SingletonStorage())
  world.registerComponentStorage('npc', new SingletonStorage())
  world.registerComponentStorage('position', new VectorStorage<PositionComponent>())
  world.registerComponentStorage('region', new MapStorage<RegionComponent>())
  world.registerComponentStorage('spawn', new SingletonStorage())
  world.registerComponentStorage('trigger', new SetStorage())
  world.registerComponentStorage('viewport-focus', new SingletonStorage())
}

export function registerResources(world: World<ComponentName, SystemName, ResourceName>, renderer: Renderer): void {
  world.registerResource(new WorldMapResource())
  world.registerResource(new ViewportResource())
  world.registerResource(new InputResource(e => renderer.eventToPosition(e)))
}

export function registerSystems(
  world: World<ComponentName, SystemName, ResourceName>,
  rayCaster: RayCaster,
  pushState: (s: State) => void
): void {
  const uniform = new Uniform('some seed')
  world.registerSystem('agent', new Agent(new Random(uniform)))
  world.registerSystem('free-mode-control', new FreeModeControl())
  world.registerSystem('light', new Light(rayCaster))
  world.registerSystem('player-control', new PlayerControl())
  world.registerSystem('player-interaction', new PlayerInteraction())
  world.registerSystem('fov', new Fov(rayCaster))
  world.registerSystem('npc', new Npc(pushState))
  world.registerSystem('region-creator', new RegionCreator(new Random(uniform)))
  world.registerSystem('trigger', new Trigger())
}
