import { World } from "./ecs/world"
import { VectorStorage, MapStorage, SetStorage, SingletonStorage } from "./ecs/storage"
import { System } from "./ecs/system"
import { Resource } from "./ecs/resource"

import { AgentComponent } from "./components/agent"
import { AssetComponent } from "./components/asset"
import { FeatureComponent } from "./components/feature"
import { GroundComponent } from "./components/ground"
import { ParentComponent } from "./components/parent"
import { PositionComponent } from "./components/position"
import { StitCellComponent } from "./components/stit-cell"

import { Agent } from "./systems/agent"
import { ViewportFocus } from "./systems/viewport-focus"

import { Render } from "./resources/render"
import { WorldMap } from "./resources/world-map"
import { Viewport } from "./resources/viewport"
import { Vector } from "./spatial"

import { Random } from "./random"
import { Uniform } from "./random/distributions"

import { RotRenderer } from "./renderer/renderer"
import { Input } from "./resources/input"
import { FreeModeControl } from "./systems/free-mode-control"
import { StitTesselator } from "./systems/stit-tesselator";

export type ComponentName =
    "active" |
    "agent" |
    "asset" |
    "feature" |
    "free-mode-anchor" |
    "ground" |
    "in-viewport" |
    "parent" |
    "position" |
    "stit-cell" |
    "viewport-focus"
export type ResourceName =
    "input" |
    "map" |
    "render" |
    "viewport"

export type TlbWorld = World<ComponentName, ResourceName>
export type TlbResource = Resource<ComponentName, ResourceName>
export type TlbSystem = System<ComponentName, ResourceName>

export function registerComponents<R>(world: World<ComponentName, R>): void {
    world.registerComponentStorage("active", new SetStorage())
    world.registerComponentStorage("agent", new MapStorage<AgentComponent>())
    world.registerComponentStorage("asset", new MapStorage<AssetComponent>())
    world.registerComponentStorage("feature", new MapStorage<FeatureComponent>())
    world.registerComponentStorage("free-mode-anchor", new SingletonStorage())
    world.registerComponentStorage("ground", new MapStorage<GroundComponent>())
    world.registerComponentStorage("in-viewport", new SetStorage())
    world.registerComponentStorage("parent", new MapStorage<ParentComponent>())
    world.registerComponentStorage("position", new VectorStorage<PositionComponent>())
    world.registerComponentStorage("stit-cell", new MapStorage<StitCellComponent>())
    world.registerComponentStorage("viewport-focus", new SingletonStorage())
}

export function registerSystems(world: World<ComponentName, ResourceName>): void {
    const uniform = new Uniform("some seed")
    world.registerSystem(new Agent(new Random(uniform)))
    world.registerSystem(new StitTesselator(uniform))
    world.registerSystem(new ViewportFocus())
    world.registerSystem(new FreeModeControl())
}

export function registerResources(world: World<ComponentName, ResourceName>): void {
    world.registerResource(new Render(new RotRenderer()))
    world.registerResource(new WorldMap(new Vector(128, 128)))
    world.registerResource(new Viewport())
    world.registerResource(new Input())
}
