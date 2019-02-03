import { World } from './ecs/world'
import { VectorStorage, MapStorage, SetStorage, SingletonStorage } from './ecs/storage'
import { System } from './ecs/system'
import { Resource } from './ecs/resource'

import { AgentComponent } from './components/agent'
import { AssetComponent } from './components/asset'
import { FeatureComponent } from './components/feature'
import { GroundComponent } from './components/ground'
import { ParentComponent } from './components/parent'
import { PositionComponent } from './components/position'
import { AgeComponent } from './components/age'
import { RegionComponent } from './components/region'

import { Agent } from './systems/agent'

import { WorldMap } from './resources/world-map'
import { Viewport } from './resources/viewport'
import { Vector } from './spatial'

import { Random } from './random'
import { Uniform } from './random/distributions'

import { Input } from './resources/input'
import { FreeModeControl } from './systems/free-mode-control'
import { RegionCreator } from './systems/region-creator'
import { PlayerControl } from './systems/player-control'
import { Renderer } from './renderer/renderer'

export type ComponentName =
  | 'active'
  | 'age'
  | 'agent'
  | 'asset'
  | 'feature'
  | 'free-mode-anchor'
  | 'ground'
  | 'in-viewport-character'
  | 'in-viewport-tile'
  | 'parent'
  | 'player'
  | 'position'
  | 'region'
  | 'spawn'
  | 'viewport-focus'
export type SystemName = 'agent' | 'free-mode-control' | 'player-control' | 'region-creator'
export type ResourceName = 'input' | 'map' | 'viewport'

export type TlbWorld = World<ComponentName, SystemName, ResourceName>
export type TlbResource = Resource<ComponentName, SystemName, ResourceName>
export type TlbSystem = System<ComponentName, SystemName, ResourceName>

export function registerComponents<S, R>(world: World<ComponentName, S, R>): void {
  world.registerComponentStorage('active', new SetStorage())
  world.registerComponentStorage('age', new MapStorage<AgeComponent>())
  world.registerComponentStorage('agent', new MapStorage<AgentComponent>())
  world.registerComponentStorage('asset', new MapStorage<AssetComponent>())
  world.registerComponentStorage('feature', new MapStorage<FeatureComponent>())
  world.registerComponentStorage('free-mode-anchor', new SingletonStorage())
  world.registerComponentStorage('ground', new MapStorage<GroundComponent>())
  world.registerComponentStorage('in-viewport-character', new SetStorage())
  world.registerComponentStorage('in-viewport-tile', new SetStorage())
  world.registerComponentStorage('parent', new MapStorage<ParentComponent>())
  world.registerComponentStorage('player', new SingletonStorage())
  world.registerComponentStorage('position', new VectorStorage<PositionComponent>())
  world.registerComponentStorage('region', new MapStorage<RegionComponent>())
  world.registerComponentStorage('spawn', new SingletonStorage())
  world.registerComponentStorage('viewport-focus', new SingletonStorage())
}

export function registerResources(world: World<ComponentName, SystemName, ResourceName>, renderer: Renderer): void {
  world.registerResource(new WorldMap(new Vector(128, 128)))
  world.registerResource(new Viewport())
  world.registerResource(new Input(e => renderer.eventToPosition(e)))
}

export function registerSystems(world: World<ComponentName, SystemName, ResourceName>): void {
  const uniform = new Uniform('some seed')
  world.registerSystem('agent', new Agent(new Random(uniform)))
  world.registerSystem('free-mode-control', new FreeModeControl())
  world.registerSystem('player-control', new PlayerControl())
  world.registerSystem('region-creator', new RegionCreator(new Random(uniform)))
}
