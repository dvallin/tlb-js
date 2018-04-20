import { DEFAULT_WIDTH } from "@/Game"
import { Position } from "@/geometry/Position"
import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { World, MapStorage, Boxed } from "mogwai-ecs/lib"
import { Display } from "rot-js"

import { Tile } from "@/map/Tile"
import { Drawable } from "@/rendering/Drawable"
import { Input } from "@/systems/Input"
import { Menu, MenuItems } from "@/systems/Menu"
import { Map } from "@/map/Map"
import { Color } from "@/rendering/Color"

export class Player implements GameSystem {

    public static NAME: string = "player"

    public renderLayer: RenderLayer = RenderLayer.None

    public register(world: World): void {
        world.registerSystem(Player.NAME, this)
        world.registerComponent("player")
        world.registerComponent("blocking")
        world.registerComponent("active", new MapStorage<Tile>())
        world.registerComponent("drawable", new MapStorage<Drawable>())
        world.registerComponent("description", new MapStorage<Boxed<string>>())
    }

    public build(world: World): void {
        const startPosition = new Position(Math.floor(DEFAULT_WIDTH / 2), 0)
        world.entity()
            .with("player")
            .with("position", new Boxed<Position>(startPosition))
            .with("blocking")
            .with("drawable", new Drawable("@", new Color([255, 255, 255])))
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
                    const player: { entity: number, position: Boxed<Position> } | undefined = world
                        .fetch()
                        .on(t => t.hasLabel("player").hasLabel("active"))
                        .withComponents("position")
                        .first()
                    if (player !== undefined) {
                        const scaledDelta = delta.normalize().mult(0.4).round()
                        const newPosition = player.position.value.add(scaledDelta)
                        const midPosition = newPosition.add(new Position(0.5, 0.5))
                        if (map.inside(newPosition) && !map.isBlocking(world, midPosition, player.entity)) {
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
