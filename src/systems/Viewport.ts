import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/Game"
import { Position } from "@/geometry/Position"
import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { World } from "mogwai-ecs/lib"
import { Display, VK_J, VK_H, VK_K, VK_L } from "rot-js"

import { Rectangle } from "@/geometry/Rectangle"
import { Size } from "@/geometry/Size"
import { Input } from "@/systems/Input"
import { Direction } from "@/geometry/Direction"
import { Map } from "@/map/Map"

export class Viewport implements GameSystem {

    public static NAME: string = "viewport"

    public renderLayer: RenderLayer = RenderLayer.None

    public viewport: Rectangle = Rectangle.from(
        new Position(0, 0),
        new Size(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    )

    public register(world: World): void {
        world.registerSystem(Viewport.NAME, this)
    }

    public build({ }: World): void {
        //
    }

    public execute(world: World): void {
        const input: Input | undefined = world.systems.get(Input.NAME) as Input | undefined
        if (input !== undefined) {
            const left = input.isPressed(VK_H)
            const down = input.isPressed(VK_J)
            const up = input.isPressed(VK_K)
            const right = input.isPressed(VK_L)
            let delta = Position.from(Direction.Center)
            if (up) {
                delta = delta.add(Position.from(Direction.North))
            }
            if (right) {
                delta = delta.add(Position.from(Direction.East))
            }
            if (down) {
                delta = delta.add(Position.from(Direction.South))
            }
            if (left) {
                delta = delta.add(Position.from(Direction.West))
            }
            this.viewport = this.viewport.add(delta.round())

            if (input.mouse.left || input.mouse.right) {
                const mouseDrag = new Position(
                    (input.mouse.x - input.mouse.clickX!) * 0.2,
                    (input.mouse.y - input.mouse.clickY!) * 0.2,
                )
                this.viewport = this.viewport.add(mouseDrag.round())
            }
        }

        const map: Map | undefined = world.systems.get(Map.NAME) as Map | undefined
        if (map !== undefined) {
            this.viewport = this.viewport.clamp(map.boundary)
        }
    }

    public render({ }: World, { }: Display): void {
        //
    }

    public get topLeft(): Position {
        return new Position(this.viewport.left, this.viewport.top)
    }
}
