import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/Game"
import { Position } from "@/geometry/Position"
import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { World, Boxed } from "mogwai-ecs/lib"
import { Display } from "rot-js"

import { Rectangle } from "@/geometry/Rectangle"
import { Size } from "@/geometry/Size"
import { Input } from "@/systems/Input"
import { Map } from "@/map/Map"
import { Menu } from "@/systems/Menu"

export enum MenuItems {
    Player = "Player",
    Map = "Map"
}

export class Viewport {
    public constructor(
        public offset: Position,
        public rectangle: Rectangle
    ) { }

    public get topLeft(): Position {
        return new Position(this.rectangle.left, this.rectangle.top).subtract(this.offset)
    }
}

export class ViewportSystem implements GameSystem {

    public static NAME: string = "viewport"

    public renderLayer: RenderLayer = RenderLayer.None

    public menuViewport: Viewport = new Viewport(
        new Position(0, 0),
        Rectangle.from(
            new Position(0, 0),
            new Size(DEFAULT_WIDTH, 1)
        )
    )

    public mapViewport: Viewport = new Viewport(
        new Position(0, 1),
        Rectangle.from(
            new Position(0, 0),
            new Size(DEFAULT_WIDTH, DEFAULT_HEIGHT - 1)
        )
    )

    public register(world: World): void {
        world.registerSystem(ViewportSystem.NAME, this)
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
            this.mapViewport.rectangle = this.mapViewport.rectangle.clamp(map.boundary)
        }
    }

    public render({ }: World, { }: Display): void {
        //
    }

    private moveMapViewport(input: Input): void {
        const delta = input.movementDelta()
        this.mapViewport.rectangle = this.mapViewport.rectangle.add(delta.round())

        if (input.mouse.left || input.mouse.right) {
            const mouseDrag = new Position(
                (input.mouse.x - input.mouse.clickX!) * 0.2,
                (input.mouse.y - input.mouse.clickY!) * 0.2,
            )
            this.mapViewport.rectangle = this.mapViewport.rectangle.add(mouseDrag.round())
        }
    }

    private focusOnPlayer(world: World): void {
        const player: { position: Boxed<Position> } | undefined = world
            .fetch()
            .on(t => t.hasLabel("player").hasLabel("active"))
            .withComponents("position")
            .first()
        if (player !== undefined) {
            this.mapViewport.rectangle = this.mapViewport.rectangle.focus(player.position.value)
        }
    }
}
