import { World } from './ecs/world'
import { VectorStorage, MapStorage, SetStorage, SingletonStorage } from './ecs/storage'
import { System } from './ecs/system'
import { Resource } from './ecs/resource'

import { AgeComponent } from './components/age'
import { AgentComponent } from './components/agent'
import { AssetComponent } from './components/asset'
import { CharacterStatsComponent } from './components/character-stats'
import { FeatureComponent } from './components/feature'
import { FovComponent } from './components/fov'
import { GroundComponent } from './components/ground'
import { LightingComponent, LightComponent } from './components/light'
import { ParentComponent, ChildrenComponent } from './components/relation'
import { PositionComponent } from './components/position'
import { RegionComponent } from './components/region'

import { Agent } from './systems/agent'
import { Fov } from './systems/fov'
import { FreeModeControl } from './systems/free-mode-control'
import { Light } from './systems/light'
import { Npc } from './systems/npc'
import { PlayerControl } from './systems/player-control'
import { PlayerInteraction } from './systems/player-interaction'
import { RegionCreator } from './systems/region-creator'
import { PlayerRoundControl } from './systems/player-round-control'
import { Trigger } from './systems/trigger'
import { Damage } from './systems/damage'
import { Script } from './systems/script'

import { WorldMapResource } from './resources/world-map'
import { ViewportResource } from './resources/viewport'

import { Random } from './random'
import { Uniform } from './random/distributions'

import { InputResource } from './resources/input'
import { Renderer } from './renderer/renderer'
import { Queries } from './renderer/queries'
import { State } from './game-states/state'
import { OverlayComponent } from './components/overlay'
import { TakeTurnComponent } from './components/rounds'
import { ScriptComponent, SelectedActionComponent, DamageComponent } from './components/action'
import { UIResource } from './resources/ui'

export type ComponentName =
  | 'active'
  | 'age'
  | 'agent'
  | 'asset'
  | 'character-stats'
  | 'children'
  | 'damage'
  | 'feature'
  | 'fov'
  | 'free-mode-anchor'
  | 'ground'
  | 'in-viewport-character'
  | 'in-viewport-tile'
  | 'light'
  | 'lighting'
  | 'npc'
  | 'overlay'
  | 'parent'
  | 'player'
  | 'position'
  | 'region'
  | 'script'
  | 'selected-action'
  | 'spawn'
  | 'take-turn'
  | 'took-turn'
  | 'trigger'
  | 'viewport-focus'
  | 'wait-turn'
export type SystemName =
  | 'agent'
  | 'damage'
  | 'fov'
  | 'free-mode-control'
  | 'info-popup'
  | 'light'
  | 'npc'
  | 'player-control'
  | 'player-round-control'
  | 'player-interaction'
  | 'region-creator'
  | 'script'
  | 'trigger'
export type ResourceName = 'input' | 'map' | 'viewport' | 'ui'

export type TlbWorld = World<ComponentName, SystemName, ResourceName>
export type TlbResource = Resource<ComponentName, SystemName, ResourceName>
export type TlbSystem = System<ComponentName, SystemName, ResourceName>

export function registerComponents<S, R>(world: World<ComponentName, S, R>): void {
  world.registerComponentStorage('active', new SetStorage())
  world.registerComponentStorage('age', new MapStorage<AgeComponent>())
  world.registerComponentStorage('agent', new MapStorage<AgentComponent>())
  world.registerComponentStorage('asset', new MapStorage<AssetComponent>())
  world.registerComponentStorage('character-stats', new MapStorage<CharacterStatsComponent>())
  world.registerComponentStorage('children', new MapStorage<ChildrenComponent>())
  world.registerComponentStorage('damage', new MapStorage<DamageComponent>())
  world.registerComponentStorage('feature', new VectorStorage<FeatureComponent>())
  world.registerComponentStorage('fov', new MapStorage<FovComponent>())
  world.registerComponentStorage('free-mode-anchor', new SingletonStorage<{}>())
  world.registerComponentStorage('ground', new MapStorage<GroundComponent>())
  world.registerComponentStorage('in-viewport-character', new SetStorage())
  world.registerComponentStorage('in-viewport-tile', new SetStorage())
  world.registerComponentStorage('light', new MapStorage<LightComponent>())
  world.registerComponentStorage('lighting', new VectorStorage<LightingComponent>())
  world.registerComponentStorage('npc', new SetStorage())
  world.registerComponentStorage('overlay', new MapStorage<OverlayComponent>())
  world.registerComponentStorage('parent', new MapStorage<ParentComponent>())
  world.registerComponentStorage('player', new SingletonStorage<{}>())
  world.registerComponentStorage('position', new VectorStorage<PositionComponent>())
  world.registerComponentStorage('region', new MapStorage<RegionComponent>())
  world.registerComponentStorage('script', new MapStorage<ScriptComponent>())
  world.registerComponentStorage('selected-action', new SingletonStorage<SelectedActionComponent>())
  world.registerComponentStorage('spawn', new SingletonStorage<{}>())
  world.registerComponentStorage('take-turn', new MapStorage<TakeTurnComponent>())
  world.registerComponentStorage('took-turn', new SetStorage())
  world.registerComponentStorage('trigger', new SetStorage())
  world.registerComponentStorage('viewport-focus', new SingletonStorage<{}>())
  world.registerComponentStorage('wait-turn', new SetStorage())
}

export function registerResources(world: World<ComponentName, SystemName, ResourceName>, renderer: Renderer): void {
  world.registerResource(new WorldMapResource())
  world.registerResource(new ViewportResource())
  world.registerResource(new InputResource(e => renderer.eventToPosition(e)))
  world.registerResource(new UIResource())
}

export function registerSystems(
  world: World<ComponentName, SystemName, ResourceName>,
  queries: Queries,
  pushState: (s: State) => void
): void {
  const uniform = new Uniform('some seed')
  world.registerSystem('agent', new Agent(new Random(uniform)))
  world.registerSystem('free-mode-control', new FreeModeControl())
  world.registerSystem('light', new Light(queries))
  world.registerSystem('player-control', new PlayerControl())
  world.registerSystem('player-round-control', new PlayerRoundControl(queries))
  world.registerSystem('player-interaction', new PlayerInteraction())
  world.registerSystem('fov', new Fov(queries))
  world.registerSystem('npc', new Npc(pushState))
  world.registerSystem('region-creator', new RegionCreator(new Random(uniform)))
  world.registerSystem('trigger', new Trigger())
  world.registerSystem('script', new Script())
  world.registerSystem('damage', new Damage())
}
