import { Vector } from "../src/spatial/vector"
import { Storage } from "../src/ecs/storage"
import { WorldMap } from "../src/resources/world-map"
import { Renderer } from "../src/renderer/renderer"
import { ComponentName, TlbWorld } from "../src/tlb"
import { Random } from "../src/random"

export function mockComponent(world: TlbWorld, component: ComponentName): Storage<{}> {
    const storage = {
        insert: jest.fn(),
        get: jest.fn(),
        remove: jest.fn(),
        has: jest.fn(),
        foreach: jest.fn(),
        clear: jest.fn()
    }
    world.registerComponentStorage(component, storage)
    return storage
}

export function mockMap(world: TlbWorld, boundary: Vector = new Vector(42, 41)): WorldMap {
    const map = {
        kind: "map",
        boundary,
        update: jest.fn(),
        isValid: jest.fn(),
        isFree: jest.fn(),
        tiles: {
            get: jest.fn()
        },
        items: {
            get: jest.fn()
        }
    }
    world.registerResource(map)
    return map
}

export function mockRenderer(): Renderer {
    return {
        clear: jest.fn(),
        eventToPosition: jest.fn(),
        drawable: jest.fn(),
        character: jest.fn(),
        text: jest.fn(),
    }
}

export function mockRandom(): Random {
    return {
        decision: jest.fn()
    }
}
