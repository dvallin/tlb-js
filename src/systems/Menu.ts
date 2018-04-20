import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { World } from "mogwai-ecs/lib"
import { Display } from "rot-js"

import { Input } from "@/systems/Input"
import { ViewportSystem } from "@/systems/Viewport"
import { primary } from "@/rendering/palettes"
import { Position } from "@/geometry/Position"

export enum MenuItems {
    Player = "Player",
    Map = "Map"
}

export class Menu implements GameSystem {

    public static NAME: string = "menu"

    public renderLayer: RenderLayer = RenderLayer.None

    public activeMenuItem: MenuItems = MenuItems.Player

    public register(world: World): void {
        world.registerSystem(Menu.NAME, this)
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
        if (viewport !== undefined) {
            const topLeft = viewport.menuViewport.topLeft
            let offset = topLeft.x
            offset += this.renderMenuItem(display, MenuItems.Player, new Position(offset, topLeft.y))
            offset += 1
            offset += this.renderMenuItem(display, MenuItems.Map, new Position(offset, topLeft.y))
        }
    }

    private renderMenuItem(display: Display, item: MenuItems, position: Position): number {
        const color = this.activeMenuItem === item ? primary[1] : primary[0]
        for (let idx = 0; idx < item.length; idx++) {
            display.draw(position.x + idx, position.y, item[idx], color.rgb)
        }
        return item.length
    }
}
