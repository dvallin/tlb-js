import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { World, Boxed } from "mogwai-ecs/lib"
import { Display } from "rot-js"

import { Input, Mouse } from "@/systems/Input"
import { ViewportSystem } from "@/rendering/Viewport"
import { primary, gray } from "@/rendering/palettes"
import { Position } from "@/geometry/Position"

import { toArray } from "@/rendering"
import { Rectangle } from "@/geometry/Rectangle"
import { rasterize as rasterizeRectangle } from "@/rendering/rectangle"
import { Size } from "@/geometry/Size"
import { Color } from "@/rendering/Color"
import { MapSystem } from "@/map/Map"
import { Tile } from "@/map/Tile"
import { Drawable } from "@/rendering/Drawable"
import { Trigger } from "@/triggers/TriggerSystem"

export enum MenuItems {
    Player = "Player",
    Map = "Map"
}

export class MenuSystem implements GameSystem {

    public static NAME: string = "menu"

    public renderLayer: RenderLayer = RenderLayer.None

    public activeMenuItem: MenuItems = MenuItems.Player

    public register(world: World): void {
        world.registerSystem(MenuSystem.NAME, this)
    }

    public build({ }: World): void {
        //
    }

    public execute(world: World): void {
        const input: Input | undefined = world.systems.get(Input.NAME) as Input | undefined
        if (input !== undefined) {
            if (input.menuItem(MenuItems.Player)) {
                this.activeMenuItem = MenuItems.Player
            } else if (input.menuItem(MenuItems.Map)) {
                this.activeMenuItem = MenuItems.Map
            }
        }
    }

    public render(world: World, display: Display): void {
        const viewport: ViewportSystem | undefined = world.systems.get(ViewportSystem.NAME) as ViewportSystem | undefined
        const map: MapSystem | undefined = world.systems.get(MapSystem.NAME) as MapSystem | undefined
        const input: Input | undefined = world.systems.get(Input.NAME) as Input | undefined
        if (viewport !== undefined && input !== undefined) {
            const topLeft = viewport.menuViewport.topLeft
            let offset = topLeft.x
            offset += this.menuItem(display, MenuItems.Player, new Position(offset, topLeft.y), input)
            offset += 1
            offset += this.menuItem(display, MenuItems.Map, new Position(offset, topLeft.y), input)

            if (this.activeMenuItem === MenuItems.Player) {
                // things near me
                const player: { entity: number, position: Boxed<Position> } | undefined = world
                    .fetch()
                    .on(t => t.hasLabel("player").hasLabel("active"))
                    .withComponents("position")
                    .first()
                if (player !== undefined) {
                    const neighbors = toArray(rasterizeRectangle(
                        Rectangle.centerAt(player.position.value, new Size(3, 3))
                    ))
                    const items = world.fetch()
                        .on(t => t.ofPartition("position", ...neighbors.map(p => new Boxed(p)))
                            .hasLabel("description")
                            .hasLabel("drawable")
                        )
                        .withComponents("description", "drawable", "trigger")
                        .collect()

                    let y = topLeft.y + 1
                    items.forEach((item) => {
                        this.entityLine(world, display, y, item.entity, item.description.value, item.drawable, item.trigger, input)
                        y++
                    })
                    const explained: Set<string> = new Set()
                    neighbors.map(position => map!.getTile(position))
                        .forEach((tile: Tile | undefined) => {
                            if (tile !== undefined && !explained.has(tile.description)) {
                                this.legendLine(display, y, tile.description, tile)
                                explained.add(tile.description)
                                y++
                            }
                        })
                }
            }
        }
    }

    public afterRender({ }: World): void {
        //
    }

    private legendLine(display: Display, y: number, description: string, drawable: Drawable): void {
        const bg = this.bgColor(false)
        this.text(display, drawable.character, new Position(0, y), drawable.diffuse, bg)
        this.text(display, description, new Position(1, y), primary[1], bg)
    }

    private entityLine(
        world: World, display: Display,
        y: number, entity: number, description: string, drawable: Drawable, trigger: Trigger, input: Input
    ): void {
        const mouseInside = this.isMouseInside(new Position(0, y), description.length + 1, input.mouse)
        if (trigger !== undefined && mouseInside && input.mousePressed()) {
            world.entity(entity).with("triggered").close()
        }
        const bg = this.bgColor(trigger !== undefined && mouseInside)
        this.text(display, drawable.character, new Position(0, y), drawable.diffuse, bg)
        this.text(display, description, new Position(1, y), primary[1], bg)
    }

    private menuItem(display: Display, item: MenuItems, position: Position, input: Input): number {
        const mouseInside = this.isMouseInside(position, item.length, input.mouse)
        if (mouseInside && input.mousePressed()) {
            this.activeMenuItem = item
        }
        const fg = this.activeMenuItem === item ? primary[1] : primary[0]
        const bg = this.bgColor(mouseInside && this.activeMenuItem !== item)
        this.text(display, item, position, fg, bg)
        return item.length
    }

    private text(display: Display, description: string, position: Position, fg: Color, bg: Color): void {
        const fgRgb = fg.rgb
        const bgRgb = bg.rgb
        for (let idx = 0; idx < description.length; idx++) {
            display.draw(position.x + idx, position.y, description[idx], fgRgb, bgRgb)
        }
    }

    private isMouseInside(position: Position, length: number, mouse: Mouse): boolean {
        return mouse.y === position.y && mouse.x >= position.x && mouse.x < position.x + length
    }

    private bgColor(clickable: boolean): Color {
        return clickable ? gray[2] : gray[4]
    }
}
