import { DEFAULT_WIDTH } from "@/Game"
import { Position } from "@/geometry/Position"
import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { World, MapStorage } from "mogwai-ecs/lib"
import { Display } from "rot-js"

import { Boxed } from "@/Boxed"
import { Tile } from "@/map/Tile"
import { Drawable } from "@/Drawable"
import { Input } from "@/systems/Input"
import { Menu, MenuItems } from "@/systems/Menu"
import { Map } from "@/map/Map"

export class Player implements GameSystem {

    public static NAME: string = "player"

    public renderLayer: RenderLayer = RenderLayer.None

    public register(world: World): void {
        world.registerSystem(Player.NAME, this)
        world.registerComponent("player")
        world.registerComponent("active", new MapStorage<Tile>())
        world.registerComponent("drawable", new MapStorage<Drawable>())
        world.registerComponent("description", new MapStorage<Boxed<string>>())
    }

    public build(world: World): void {
        const startPosition = new Position(Math.floor(DEFAULT_WIDTH / 2), 0)
        world.entity()
            .with("player")
            .with("position", new Boxed<Position>(startPosition))
            .with("drawable", { character: "@", color: "white" })
            .with("active")
            .close()
    }

    public execute(world: World): void {
        const input: Input | undefined = world.systems.get(Input.NAME) as Input | undefined
        const menu: Menu | undefined = world.systems.get(Menu.NAME) as Menu | undefined
        const map: Map | undefined = world.systems.get(Map.NAME) as Map | undefined
        if (input !== undefined && menu !== undefined && map !== undefined) {
            if (menu.activeMenuItem === MenuItems.Player) {
                const delta = input.movementDelta()
                if (delta.x !== 0 || delta.y !== 0) {
                    const player: { position: Boxed<Position> } | undefined = world
                        .fetch()
                        .on(t => t.hasLabel("player").hasLabel("active"))
                        .withComponents("position")
                        .first()
                    if (player !== undefined) {
                        const newPosition = player.position.value.add(delta.normalize().mult(0.4).round())
                        const midPosition = newPosition.add(new Position(0.5, 0.5))
                        if (!map.isBlocking(midPosition)) {
                            player.position.value = newPosition
                        }
                    }
                }
            }
        }
    }

    public render({ }: World, { }: Display): void {
        //
    }
}
