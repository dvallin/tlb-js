import { Random } from "../random"
import { Vector } from "../spatial"
import { TlbWorld } from "../tlb"
import { Entity } from "../ecs/entity"
import { WorldMap } from "src/resources/world-map"
import { Shape } from "src/geometry/shape"

import { FeatureType, FeatureComponent, features } from "./feature"
import { OwnerComponent } from "./owner"
import { GroundComponent } from "./ground"
import { PositionComponent } from "./position";

export type AssetType = "door" | "locker" | "trash"
export interface AssetComponent {
    type: AssetType
}

export interface Asset {
    spawn: (world: TlbWorld, position: Vector, random: Random) => void
}

export function createLocker(world: TlbWorld, map: WorldMap, position: Vector): Entity {
    const entity = createAsset(world, "locker")
    putTile(world, map, position, entity, "locker")
    return entity
}

export function createTrash(world: TlbWorld, map: WorldMap, position: Vector): Entity {
    const entity = createAsset(world, "trash")
    putTile(world, map, position, entity, "trash")
    return entity
}

export function createDoor(world: TlbWorld, map: WorldMap, shape: Shape): Entity {
    const entity = createAsset(world, "door")
    shape.foreach(position => {
        putTile(world, map, position, entity, "door")
    })
    return entity
}

function createAsset(world: TlbWorld, type: AssetType): Entity {
    return world
        .createEntity()
        .withComponent<AssetComponent>("asset", { type })
        .entity
}

function putTile(world: TlbWorld, map: WorldMap, position: Vector, entity: Entity, type: FeatureType): void {
    const feature = removeGround(world, map, position)
    const tile = world
        .createEntity()
        .withComponent<PositionComponent>("position", { position })
        .withComponent<FeatureComponent>("feature", { type })
        .withComponent<OwnerComponent>("owner", { entity })
        .withComponent<GroundComponent>("ground", { feature })
        .entity
    map.tiles.set(position, tile)
}

function removeGround(world: TlbWorld, map: WorldMap, position: Vector): FeatureType {
    const entity = map.tiles.remove(position)
    if (entity === undefined) {
        throw new Error(`cannot build asset on missing ground at ${position.key}`)
    }
    const feature = world.getComponent<FeatureComponent>(entity, "feature")
    if (feature === undefined || features[feature.type].blocking) {
        throw new Error("cannot build asset on missing or blocking ground")
    }
    world.deleteEntity(entity)
    return feature.type
}
