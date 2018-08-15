import { Position } from "@/geometry/Position"
import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { World, Boxed } from "mogwai-ecs/lib"
import { Display } from "rot-js"

import { Rectangle } from "@/geometry/Rectangle"
import { Vector } from "@/geometry/Vector"
import { Input } from "@/systems/Input"
import { MapSystem } from "@/map/Map"
import { MenuSystem, MenuItems } from "@/menu/Menu"
import { GameSettings } from "@/Game"

export class Viewport {
    public constructor(
        public offset: Vector,
        public rectangle: Rectangle
    ) { }

    public get topLeft(): Vector {
        return this.offset.mult(-1).add(new Vector([this.rectangle.left, this.rectangle.top]))
    }
}

export class ViewportSystem implements GameSystem {

    public static NAME: string = "viewport"

    public static fromSettings(settings: GameSettings): ViewportSystem {
        return new ViewportSystem(settings.screen_width, settings.screen_height)
    }

    public renderLayer: RenderLayer = RenderLayer.None

    public readonly menuViewport: Viewport
    public readonly mapViewport: Viewport

    private constructor(width: number, height: number) {
        this.menuViewport = new Viewport(
            new Vector([0, 0]),
            Rectangle.from(
                new Vector([0, 0]),
                new Vector([width, 5])
            )
        )
        this.mapViewport = new Viewport(
            new Vector([0, 6]),
            Rectangle.from(
                new Vector([0, 0]),
                new Vector([width, height - 5])
            )
        )
    }

    public register(world: World): void {
        world.registerSystem(ViewportSystem.NAME, this)
    }

    public build({ }: World): void {
        //
    }

    public execute(world: World): void {
        const input: Input | undefined = world.systems.get(Input.NAME) as Input | undefined
        const menu: MenuSystem | undefined = world.systems.get(MenuSystem.NAME) as MenuSystem | undefined
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

        const map: MapSystem | undefined = world.systems.get(MapSystem.NAME) as MapSystem | undefined
        if (map !== undefined) {
            this.mapViewport.rectangle = this.mapViewport.rectangle.clamp(map.boundary)
        }
    }

    public render({ }: World, { }: Display): void {
        //
    }

    public afterRender({ }: World): void {
        //
    }

    private moveMapViewport(input: Input): void {
        const delta = input.movementDelta()
        this.mapViewport.rectangle = this.mapViewport.rectangle.add(delta.fround())

        if (input.mouse.left || input.mouse.right) {
            const mouseDrag = new Vector([
                (input.mouse.x - input.mouse.clickX!) * 0.2,
                (input.mouse.y - input.mouse.clickY!) * 0.2,
            ])
            this.mapViewport.rectangle = this.mapViewport.rectangle.add(mouseDrag.fround())
        }
    }

    private focusOnPlayer(world: World): void {
        const player: { position: Boxed<Position> } | undefined = world
            .fetch()
            .on(t => t.hasLabel("player").hasLabel("active"))
            .withComponents("position")
            .first()
        if (player !== undefined) {
            this.mapViewport.rectangle = this.mapViewport.rectangle.focus(player.position.value.pos)
        }
    }
}
