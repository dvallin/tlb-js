import { World } from "@/ecs/world"
import { VectorStorage, MapStorage, SetStorage } from "@/ecs/storage"
import { System } from "@/ecs/system"
import { Resource } from "@/ecs/resource"

import { PositionComponent } from "@/components/position"
import { FeatureComponent } from "@/components/feature"
import { TunnellerComponent } from "@/components/tunneller"

import { Tunneller } from "@/systems/tunneller"

import { Render } from "@/resources/render"
import { WorldMap } from "@/resources/world-map"
import { Viewport } from "@/resources/viewport"
import { Vector } from "@/spatial"

import { SeedableRandom } from "@/random"
import { RotRenderer } from "@/renderer/renderer"

export type ComponentName = "position" | "feature" | "in-viewport" | "active" | "tunneller"
export type ResourceName = "map" | "viewport" | "render"

export type TlbWorld = World<ComponentName, ResourceName>
export type TlbResource = Resource<ComponentName, ResourceName>
export type TlbSystem = System<ComponentName, ResourceName>

export function registerComponents<R>(world: World<ComponentName, R>): void {
    world.registerComponentStorage("position", new VectorStorage<PositionComponent>())
    world.registerComponentStorage("feature", new MapStorage<FeatureComponent>())
    world.registerComponentStorage("tunneller", new MapStorage<TunnellerComponent>())
    world.registerComponentStorage("in-viewport", new SetStorage())
    world.registerComponentStorage("active", new SetStorage())
}

export function registerSystems(world: World<ComponentName, ResourceName>): void {
    world.registerSystem(new Tunneller(new SeedableRandom("some see")))
}

export function registerResources(world: World<ComponentName, ResourceName>): void {
    world.registerResource(new Render(new RotRenderer()))
    world.registerResource(new WorldMap(new Vector(128, 128)))
    world.registerResource(new Viewport())
}
