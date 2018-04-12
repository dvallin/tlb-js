import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/Game"
import { Position } from "@/geometry/Position"
import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { World } from "mogwai-ecs/lib"
import { Display } from "rot-js"

import { Rectangle } from "@/geometry/Rectangle"
import { Size } from "@/geometry/Size"
import { Input } from "@/systems/Input"
import { Map } from "@/map/Map"
import { Boxed } from "@/Boxed"
import { Menu } from "@/systems/Menu"

export enum MenuItems {
    Player = "Player",
    Map = "Map"
}

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
        const menu: Menu | undefined = world.systems.get(Menu.NAME) as Menu | undefined
        if (input !== undefined && menu !== undefined) {
            switch (menu.activeMenuItem) {
                case MenuItems.Map:
                    this.moveMapViewport(input)
                    break
                case MenuItems.Player:
                    this.focusOnPlayer(world)
                    break
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

    private moveMapViewport(input: Input): void {
        const delta = input.movementDelta()
        this.viewport = this.viewport.add(delta.round())

        if (input.mouse.left || input.mouse.right) {
            const mouseDrag = new Position(
                (input.mouse.x - input.mouse.clickX!) * 0.2,
                (input.mouse.y - input.mouse.clickY!) * 0.2,
            )
            this.viewport = this.viewport.add(mouseDrag.round())
        }
    }

    private focusOnPlayer(world: World): void {
        const player: { position: Boxed<Position> } | undefined = world
            .fetch()
            .on(t => t.hasLabel("player").hasLabel("active"))
            .withComponents("position")
            .first()
        if (player !== undefined) {
            this.viewport = this.viewport.focus(player.position.value)
        }
    }
}
