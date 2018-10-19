import { Render } from "../../src/resources/render"
import { mockRenderer, mockComponent, mockImplementation } from "../mocks"
import { World } from "../../src/ecs/world"
import { Vector } from "../../src/spatial/vector"
import { features } from "../../src/components/feature"
import { Renderer } from "../../src/renderer/renderer"
import { TlbWorld } from "../../src/tlb"
import { Storage } from "../../src/ecs/storage"

describe("Render", () => {

    let renderer: Renderer

    let render: Render
    let world: TlbWorld
    let featureStorage: Storage<{}>
    let positions: Storage<{}>
    let inViewport: Storage<{}>
    beforeEach(() => {

        renderer = mockRenderer()
        render = new Render(renderer)
        world = new World()
        featureStorage = mockComponent(world, "feature")
        positions = mockComponent(world, "position")
        inViewport = mockComponent(world, "in-viewport")
    })

    it("clears the screen", () => {
        render.update(world)

        expect(renderer.clear).toHaveBeenCalledTimes(1)
    })

    it("calls foreach on inViewport", () => {
        render.update(world)

        expect(inViewport.foreach).toHaveBeenCalledTimes(1)
    })

    it("does not render entities without position and feature", () => {
        mockImplementation(inViewport.foreach, (f: (entity: number, value: {}) => void) => f(42, {}))

        render.update(world)

        expect(renderer.character).toHaveBeenCalledTimes(0)
    })

    it("renders each in viewport entity", () => {
        mockImplementation(inViewport.foreach, (f: (entity: number, value: {}) => void) => f(42, {}))
        mockImplementation(featureStorage.get, () => ({ type: "wall" }))
        mockImplementation(positions.get, () => ({ position: new Vector(2, 43) }))

        render.update(world)

        expect(renderer.character).toHaveBeenCalledTimes(1)
        expect(renderer.character).toHaveBeenCalledWith(
            features.wall.character, new Vector(2, 43), features.wall.diffuse
        )
    })
})
