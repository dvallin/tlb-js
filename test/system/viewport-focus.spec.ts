import { ViewportFocus } from "../../src/systems/viewport-focus"
import { TlbWorld } from "../../src/tlb"
import { World } from "../../src/ecs/world"

import { Viewport } from "../../src/resources/viewport"
import { PositionComponent } from "../../src/components/position"
import { MapStorage } from "../../src/ecs/storage"
import { Vector } from "../../src/spatial";

describe(ViewportFocus.name, () => {

    let system: ViewportFocus
    let world: TlbWorld
    let viewport: Viewport
    beforeEach(() => {
        viewport = new Viewport()
        system = new ViewportFocus()
        world = new World()
        world.registerComponentStorage<PositionComponent>("position", new MapStorage())
        world.registerResource(viewport)
    })

    it("focuses on selected position", () => {
        // given
        viewport.focus = jest.fn()
        const entity = world.createEntity()
            .withComponent<PositionComponent>("position", { position: new Vector(1, 2) })
            .entity

        // when
        system.update(world, entity)

        // then
        expect(viewport.focus).toHaveBeenCalledWith(new Vector(1, 2))
    })
})
