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
import { ApplyEffects } from './systems/apply-effect'
import { Script } from './systems/script'

import { WorldMapResource } from './resources/world-map'
import { ViewportResource } from './resources/viewport'
import { InputResource } from './resources/input'
import { UIResource } from './resources/ui'
import { LogResource } from './resources/log'

import { Random } from './random'
import { Uniform } from './random/distributions'

import { Renderer } from './renderer/renderer'
import { Queries } from './renderer/queries'
import { State } from './game-states/state'
import { OverlayComponent } from './components/overlay'
import { TakeTurnComponent } from './components/rounds'
import { SelectedActionComponent, HasActionComponent } from './components/action'
import { ScriptComponent } from './components/script'
import { AiComponent } from './components/ai'
import { AiRoundControl } from './systems/ai-round-control'
import { TriggersComponent, TriggeredByComponent } from './components/trigger'
import { EffectComponent, ActiveEffectsComponent } from './components/effects'
import { InventoryComponent, ItemComponent, EquipedItemsComponent } from './components/items'

export type ComponentName =
  | 'active'
  | 'age'
  | 'agent'
  | 'ai'
  | 'asset'
  | 'character-stats'
  | 'effect'
  | 'equiped-items'
  | 'feature'
  | 'fov'
  | 'free-mode-anchor'
  | 'ground'
  | 'has-action'
  | 'inventory'
  | 'item'
  | 'light'
  | 'lighting'
  | 'npc'
  | 'overlay'
  | 'player'
  | 'position'
  | 'region'
  | 'script'
  | 'selected-action'
  | 'active-effects'
  | 'spawn'
  | 'take-turn'
  | 'took-turn'
  | 'triggered-by'
  | 'triggers'
  | 'viewport-focus'
  | 'wait-turn'
export type SystemName =
  | 'agent'
  | 'ai-round-control'
  | 'effect'
  | 'fov'
  | 'free-mode-control'
  | 'info-popup'
  | 'light'
  | 'npc'
  | 'player-control'
  | 'player-interaction'
  | 'player-round-control'
  | 'region-creator'
  | 'script'
  | 'trigger'
export type ResourceName = 'input' | 'map' | 'viewport' | 'ui' | 'log'

export type TlbWorld = World<ComponentName, SystemName, ResourceName>
export type TlbResource = Resource<ComponentName, SystemName, ResourceName>
export type TlbSystem = System<ComponentName, SystemName, ResourceName>

export function registerComponents<S, R>(world: World<ComponentName, S, R>): void {
  world.registerComponentStorage('active', new SetStorage())
  world.registerComponentStorage('age', new MapStorage<AgeComponent>())
  world.registerComponentStorage('agent', new MapStorage<AgentComponent>())
  world.registerComponentStorage('ai', new MapStorage<AiComponent>())
  world.registerComponentStorage('asset', new MapStorage<AssetComponent>())
  world.registerComponentStorage('character-stats', new MapStorage<CharacterStatsComponent>())
  world.registerComponentStorage('effect', new MapStorage<EffectComponent>())
  world.registerComponentStorage('feature', new VectorStorage<FeatureComponent>())
  world.registerComponentStorage('fov', new MapStorage<FovComponent>())
  world.registerComponentStorage('free-mode-anchor', new SingletonStorage<{}>())
  world.registerComponentStorage('ground', new MapStorage<GroundComponent>())
  world.registerComponentStorage('has-action', new MapStorage<HasActionComponent>())
  world.registerComponentStorage('inventory', new MapStorage<InventoryComponent>())
  world.registerComponentStorage('equiped-items', new MapStorage<EquipedItemsComponent>())
  world.registerComponentStorage('item', new MapStorage<ItemComponent>())
  world.registerComponentStorage('light', new MapStorage<LightComponent>())
  world.registerComponentStorage('lighting', new VectorStorage<LightingComponent>())
  world.registerComponentStorage('npc', new SetStorage())
  world.registerComponentStorage('overlay', new MapStorage<OverlayComponent>())
  world.registerComponentStorage('player', new SingletonStorage<{}>())
  world.registerComponentStorage('position', new VectorStorage<PositionComponent>())
  world.registerComponentStorage('region', new MapStorage<RegionComponent>())
  world.registerComponentStorage('script', new MapStorage<ScriptComponent>())
  world.registerComponentStorage('selected-action', new SingletonStorage<SelectedActionComponent>())
  world.registerComponentStorage('active-effects', new MapStorage<ActiveEffectsComponent>())
  world.registerComponentStorage('spawn', new SingletonStorage<{}>())
  world.registerComponentStorage('take-turn', new MapStorage<TakeTurnComponent>())
  world.registerComponentStorage('took-turn', new SetStorage())
  world.registerComponentStorage('triggered-by', new MapStorage<TriggeredByComponent>())
  world.registerComponentStorage('triggers', new MapStorage<TriggersComponent>())
  world.registerComponentStorage('viewport-focus', new SingletonStorage<{}>())
  world.registerComponentStorage('wait-turn', new SetStorage())
}

export function registerResources(world: World<ComponentName, SystemName, ResourceName>, renderer: Renderer): void {
  world.registerResource(new WorldMapResource())
  world.registerResource(new ViewportResource(renderer.boundaries))
  world.registerResource(new InputResource(e => renderer.eventToPosition(e)))
  world.registerResource(new UIResource())
  world.registerResource(new LogResource())
}

export function registerSystems(
  world: World<ComponentName, SystemName, ResourceName>,
  queries: Queries,
  pushState: (s: State) => void
): void {
  const uniform = new Uniform('some seed')
  world.registerSystem('agent', new Agent(new Random(uniform)))
  world.registerSystem('ai-round-control', new AiRoundControl(queries, new Random(uniform)))
  world.registerSystem('effect', new ApplyEffects())
  world.registerSystem('fov', new Fov(queries))
  world.registerSystem('free-mode-control', new FreeModeControl())
  world.registerSystem('light', new Light(queries))
  world.registerSystem('npc', new Npc(pushState))
  world.registerSystem('player-control', new PlayerControl())
  world.registerSystem('player-interaction', new PlayerInteraction())
  world.registerSystem('player-round-control', new PlayerRoundControl(queries, new Random(uniform)))
  world.registerSystem('region-creator', new RegionCreator(new Random(uniform)))
  world.registerSystem('script', new Script())
  world.registerSystem('trigger', new Trigger())
}
