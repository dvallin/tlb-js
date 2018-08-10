import { GameSettings } from "@/Game"
import { Position, Domain } from "@/geometry/Position"
import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { World, MapStorage, Boxed } from "mogwai-ecs/lib"
import { Display } from "rot-js"

import { Tile } from "@/map/Tile"
import { Drawable } from "@/rendering/Drawable"
import { Input } from "@/systems/Input"
import { MenuSystem, MenuItems } from "@/menu/Menu"
import { MapSystem } from "@/map/Map"
import { Color } from "@/rendering/Color"
import { Vector2D } from "@/geometry/Vector2D"

export class PlayerSystem implements GameSystem {

    public static NAME: string = "player"

    public static fromSettings(settings: GameSettings): PlayerSystem {
        return new PlayerSystem(settings.map_width)
    }

    public renderLayer: RenderLayer = RenderLayer.None

    public readonly playerSpawn: Position

    private constructor(width: number) {
        this.playerSpawn = new Position(Domain.Tower, new Vector2D(Math.floor(width / 2), 0))
    }

    public register(world: World): void {
        world.registerSystem(PlayerSystem.NAME, this)
        world.registerComponent("player")
        world.registerComponent("blocking")
        world.registerComponent("active", new MapStorage<Tile>())
        world.registerComponent("drawable", new MapStorage<Drawable>())
    }

    public build(world: World): void {
        world.entity()
            .with("player")
            .with("position", new Boxed<Position>(this.playerSpawn))
            .with("blocking")
            .with("drawable", new Drawable("@", new Color([255, 255, 255])))
            .with("active")
            .close()
    }

    public execute(world: World): void {
        const input: Input | undefined = world.systems.get(Input.NAME) as Input | undefined
        const menu: MenuSystem | undefined = world.systems.get(MenuSystem.NAME) as MenuSystem | undefined
        const map: MapSystem | undefined = world.systems.get(MapSystem.NAME) as MapSystem | undefined
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
                        const scaledDelta = delta.normalize().mult(0.4).fround()
                        const newPosition = player.position.value.add(scaledDelta)
                        if (map.isInside(newPosition) && !map.isBlocking(world, newPosition, player.entity)) {
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

    public afterRender({ }: World): void {
        //
    }
}
