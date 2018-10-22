import { Color } from "../renderer/color"
import { gray, primary } from "../renderer/palettes"
import { TlbWorld } from "../tlb"

import { FeatureComponent } from "./feature"

export type FeatureType = keyof typeof features
export interface FeatureComponent {
    type: FeatureType
}

export interface Feature {
    character: string,
    diffuse: Color,

    blocking: boolean,
    lightBlocking: boolean,
    description: string
}

export const features = {
    wall: {
        character: "#", diffuse: gray[3],
        blocking: true, lightBlocking: true,
        description: "a wall"
    },
    corridor: {
        character: ".", diffuse: gray[0],
        blocking: false, lightBlocking: false,
        description: "a corridor"
    },
    room: {
        character: ".", diffuse: primary[1],
        blocking: false, lightBlocking: false,
        description: "floor of a room"
    },
    hub: {
        character: ".", diffuse: primary[0],
        blocking: false, lightBlocking: false,
        description: "floor of a hub"
    }
}

export function getFeature(world: TlbWorld, entity: number): Feature | undefined {
    const feature = world.getComponent<FeatureComponent>(entity, "feature")
    if (feature) {
        return features[feature.type]
    }
    return undefined
}
