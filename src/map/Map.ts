import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/Game"
import { Position } from "@/geometry/Position"
import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { MapStorage, VectorStorage, World } from "mogwai-ecs/lib"
import { Display, VK_J, VK_H, VK_K, VK_L } from "rot-js"
import { Boxed } from "@/Boxed"

import { TunnelingBuilder } from "./generators/TunnelingBuilder"
import { Tile, wallTile, doorTile, roomTile, hubTile } from "@/map/Tile"
import { Drawable } from "@/Drawable"
import { foreach } from "@/rendering"
import { Rectangle } from "@/geometry/Rectangle"
import { rasterize as rasterizeRectangle } from "@/rendering/rectangle"
import { Size } from "@/geometry/Size"
import { Input } from "@/systems/Input"
import { Direction } from "@/geometry/Direction"

export class Map implements GameSystem {

    public static NAME: string = "map"

    public rooms: number = 0
    public renderLayer: RenderLayer = RenderLayer.Layer1

    private map: Tile[] = []
    private mapBoundary: Size = new Size(2 * DEFAULT_WIDTH, 2 * DEFAULT_HEIGHT)
    private viewport: Rectangle = Rectangle.from(
        new Position(0, 0),
        new Size(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    )

    public register(world: World): void {
        world.registerSystem(Map.NAME, this)
        world.registerComponent("active", new MapStorage<Tile>())
        world.registerComponent("drawable", new MapStorage<Drawable>())
        world.registerComponent("position", new VectorStorage<Boxed<Position>>())
    }

    public build(world: World): void {
        for (let y = 0; y < this.mapBoundary.height; y++) {
            for (let x = 0; x < this.mapBoundary.width; x++) {
                this.set(new Position(x, y), wallTile())
            }
        }

        const entrance = new Position(Math.floor(DEFAULT_WIDTH / 2), 0)
        new TunnelingBuilder(world, this)
            .startAt(entrance)
            .run()
    }

    public execute(world: World): void {
        const input: Input | undefined = world.systems.get(Input.NAME) as Input | undefined
        if (input !== undefined) {
            const left = input.isPressed(VK_H)
            const down = input.isPressed(VK_J)
            const up = input.isPressed(VK_K)
            const right = input.isPressed(VK_L)
            let delta = Position.from(Direction.Center)
            if (up) {
                delta = delta.add(Position.from(Direction.North))
            }
            if (right) {
                delta = delta.add(Position.from(Direction.East))
            }
            if (down) {
                delta = delta.add(Position.from(Direction.South))
            }
            if (left) {
                delta = delta.add(Position.from(Direction.West))
            }
            this.viewport = this.viewport.add(delta)

            if (input.mouse.left || input.mouse.right) {
                const mouseDrag = new Position(
                    (input.mouse.x - input.mouse.clickX!) * 0.2,
                    (input.mouse.y - input.mouse.clickY!) * 0.2,
                )
                this.viewport = this.viewport.add(mouseDrag)
            }

            this.viewport = this.viewport.clamp(this.mapBoundary)
        }
    }

    public render(world: World, display: Display): void {
        const topLeft = new Position(this.viewport.left, this.viewport.top)
        foreach(rasterizeRectangle(this.viewport, true), position => {
            const tile: Tile | undefined = this.get(position)
            if (tile !== undefined) {
                const mapPosition = position.subtract(topLeft)
                this.renderDrawable(display, mapPosition, tile)
            }
        })

        world.fetch()
            .on(v => v.hasLabel("drawable").hasLabel("position"))
            .withComponents("position", "drawable")
            .stream().each((comp: { position: Boxed<Position>, drawable: Drawable }) => {
                this.renderDrawable(display, comp.position.value.subtract(topLeft), comp.drawable)
            })
    }

    public set(position: Position, tile: Tile): void {
        this.map[position.x + position.y * this.mapBoundary.width] = tile
    }

    public get(position: Position): Tile | undefined {
        if (!this.inside(position)) {
            return undefined
        }
        return this.map[position.x + position.y * this.mapBoundary.width]
    }

    public inside(position: Position): boolean {
        return position.x >= 0 && position.y >= 0 && position.x < this.mapBoundary.width && position.y < this.mapBoundary.height
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
