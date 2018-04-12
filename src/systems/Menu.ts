import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { World } from "mogwai-ecs/lib"
import { Display } from "rot-js"

import { Input } from "@/systems/Input"

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

    public render({ }: World, { }: Display): void {
        //
    }
}
