import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/Game"
import { Position } from "@/geometry/Position"
import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { MapStorage, VectorStorage, World } from "mogwai-ecs/lib"
import { Display } from "rot-js"
import { Boxed } from "@/Boxed"

import { TunnelingBuilder } from "./generators/TunnelingBuilder"
import { Tile, wallTile, doorTile, roomTile, hubTile } from "@/map/Tile"
import { Drawable } from "@/Drawable"
import { foreach } from "@/rendering"
import { Rectangle } from "@/geometry/Rectangle"
import { rasterize as rasterizeRectangle } from "@/rendering/rectangle"

export class Map implements GameSystem {

    public static NAME: string = "map"

    public rooms: number = 0
    public renderLayer: RenderLayer = RenderLayer.Layer1

    private map: Tile[] = []

    public register(world: World): void {
        world.registerSystem(Map.NAME, this)
        world.registerComponent("active", new MapStorage<Tile>())
        world.registerComponent("drawable", new MapStorage<Drawable>())
        world.registerComponent("position", new VectorStorage<Boxed<Position>>())
    }

    public build(world: World): void {
        for (let y = 0; y < DEFAULT_HEIGHT; y++) {
            for (let x = 0; x < DEFAULT_WIDTH; x++) {
                this.set(new Position(x, y), wallTile())
            }
        }

        const entrance = new Position(Math.floor(DEFAULT_WIDTH / 2), 0)
        new TunnelingBuilder(world, this)
            .startAt(entrance)
            .run()
    }

    public set(position: Position, tile: Tile): void {
        this.map[position.x + position.y * DEFAULT_WIDTH] = tile
    }

    public get(position: Position): Tile | undefined {
        if (!this.inside(position)) {
            return undefined
        }
        return this.map[position.x + position.y * DEFAULT_WIDTH]
    }

    public inside(position: Position): boolean {
        return position.x >= 0 && position.y >= 0 && position.x < DEFAULT_WIDTH && position.y < DEFAULT_HEIGHT
    }

    public execute({ }: World): void {
        //
    }

    public render(world: World, display: Display): void {
        for (let y = 0; y < DEFAULT_HEIGHT; y++) {
            for (let x = 0; x < DEFAULT_WIDTH; x++) {
                this.renderPosition(display, new Position(x, y))
            }
        }
        world.fetch()
            .on(v => v.hasLabel("drawable").hasLabel("position"))
            .withComponents("position", "drawable")
            .stream().each((comp: { position: Boxed<Position>, drawable: Drawable }) => {
                this.renderDrawable(display, comp.position.value, comp.drawable)
            })
    }

    public buildDoor(position: Position): void {
        this.set(position, doorTile())
    }

    public buildRoom(rectangle: Rectangle): void {
        this.rooms++
        foreach(rasterizeRectangle(rectangle, true), (p: Position) =>
            this.set(p, roomTile(this.rooms))
        )
    }

    public buildHub(rectangle: Rectangle): void {
        this.rooms++
        foreach(rasterizeRectangle(rectangle, true), (p: Position) =>
            this.set(p, hubTile(this.rooms))
        )
    }

    public buildAsset(position: Position, asset: (Tile | undefined)[]): void {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const tile: Tile | undefined = asset[4 * y + x]
                if (tile !== undefined) {
                    this.set(new Position(position.x + x - 1, position.y + y - 1), tile)
                }
            }
        }
    }

    public isFree(positions: Position[]): boolean {
        return positions.find(p => !this.inside(p) || this.hasRoomPredicate(p)) === undefined
    }

    public isWalls(positions: Position[]): boolean {
        return positions.find(p => !this.inside(p) || !this.isWallPredicate(p)) === undefined
    }

    private renderPosition(display: Display, position: Position): void {
        const tile: Tile | undefined = this.get(position)
        if (tile !== undefined) {
            this.renderDrawable(display, position, tile)
        }
    }

    private hasRoomPredicate(p: Position): boolean {
        const tile: Tile | undefined = this.get(p)
        return tile !== undefined && tile.room !== undefined
    }

    private isWallPredicate(p: Position): boolean {
        const tile: Tile | undefined = this.get(p)
        return tile !== undefined && tile.character === "#"
    }

    private renderDrawable(display: Display, position: Position, drawable: Drawable): void {
        display.draw(position.x, position.y, drawable.character, drawable.color)
    }
}
