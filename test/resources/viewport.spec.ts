import { Viewport } from "../../src/resources/viewport"

import { World } from "../../src/ecs/world"
import { ComponentName, ResourceName, TlbWorld } from "../../src/tlb"

import { mockComponent, mockMap, mockImplementation } from "../mocks"
import { Storage } from "../../src/ecs/storage"
import { WorldMap } from "../../src/resources/world-map"
import { Vector } from "../../src/spatial/vector"

describe("Viewport", () => {

    let viewport: Viewport

    let inViewport: Storage<{}>
    let map: WorldMap
    let world: TlbWorld
    beforeEach(() => {
        world = new World<ComponentName, ResourceName>()
        map = mockMap(world)
        mockImplementation(map.tiles.get, (vector: Vector) => vector.key === "1,1" ? 42 : undefined)
        inViewport = mockComponent(world, "in-viewport")

        viewport = new Viewport()
    })

    it("adds entities into the viewport", () => {
        viewport.update(world)

        expect(map.tiles.get).toHaveBeenCalledTimes(60 * 40)
    })

    it("clears in viewport components", () => {
        viewport.update(world)

        expect(inViewport.clear).toHaveBeenCalledTimes(1)
    })

    it("adds entities into the viewport", () => {
        mockImplementation(map.tiles.get, (vector: Vector) => vector.key === "1,1" ? 42 : undefined)

        viewport.update(world)

        expect(inViewport.insert).toHaveBeenCalledWith(42, {})
    })
})
