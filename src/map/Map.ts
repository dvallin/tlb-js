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
import { Size } from "@/geometry/Size"
import { Input } from "@/systems/Input"
import { gridSymbols } from "@/symbols"
import { gray } from "@/palettes"
import { Viewport } from "@/systems/Viewport"

export class Map implements GameSystem {

    public static NAME: string = "map"

    public readonly boundary: Size = new Size(2 * DEFAULT_WIDTH, 2 * DEFAULT_HEIGHT)
    public renderLayer: RenderLayer = RenderLayer.Layer1

    private map: Tile[] = []
    private selectedRoom: number | undefined

    public register(world: World): void {
        world.registerSystem(Map.NAME, this)
        world.registerComponent("active", new MapStorage<Tile>())
        world.registerComponent("drawable", new MapStorage<Drawable>())
        world.registerComponent("description", new MapStorage<Boxed<string>>())
        world.registerComponent("position", new VectorStorage<Boxed<Position>>())

        world.registerComponent("room")
        world.registerRelation("contains")
        world.registerRelation("connected")
    }

    public build(world: World): void {
        for (let y = 0; y < this.boundary.height; y++) {
            for (let x = 0; x < this.boundary.width; x++) {
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
        const viewport: Viewport | undefined = world.systems.get(Viewport.NAME) as Viewport | undefined
        if (input !== undefined && viewport !== undefined) {
            const mousePosition = new Position(input.mouse.x, input.mouse.y)
            const topLeft = viewport.topLeft
            const tile = this.get(mousePosition.add(topLeft))
            if (tile !== undefined) {
                this.selectedRoom = tile.room
            }
        }
    }

    public render(world: World, display: Display): void {
        const viewport: Viewport | undefined = world.systems.get(Viewport.NAME) as Viewport | undefined
        if (viewport !== undefined) {
            const topLeft = viewport.topLeft
            foreach(rasterizeRectangle(viewport.viewport, true), position => {
                const tile: Tile | undefined = this.get(position)
                if (tile !== undefined) {
                    const mapPosition = position.subtract(topLeft)
                    this.renderTile(display, mapPosition, tile)
                }
            })

            interface DrawableWithData {
                position: Boxed<Position>, description: Boxed<string> | undefined, drawable: Drawable
            }
            const allDrawables: DrawableWithData[] = world
                .fetch()
                .on(v => v.hasLabel("drawable").hasLabel("position")
                    .matchesValue("position", (p: Boxed<Position>) => viewport.viewport.isInside(p.value))
                )
                .withComponents("position", "drawable", "description")
                .collect()

            const alreadyDrawn = new Set<number>()
            allDrawables.forEach((comp: DrawableWithData) => {
                const p = comp.position.value.subtract(topLeft)
                this.renderDrawable(display, p, comp.drawable)
                const idx = this.index(p)
                if (idx !== undefined) {
                    alreadyDrawn.add(idx)
                }
            })
            allDrawables.forEach((comp: DrawableWithData) => {
                if (comp.description !== undefined) {
                    this.tryToDrawDescription(display, comp.position.value.subtract(topLeft), comp.description.value, alreadyDrawn)
                }
            })
        }
    }

    public set(position: Position, tile: Tile): void {
        const idx = this.index(position)
        if (idx !== undefined) {
            this.map[idx] = tile
        }
    }

    public get(position: Position): Tile | undefined {
        const idx = this.index(position)
        if (idx !== undefined) {
            return this.map[idx]
        }
        return undefined
    }

    public index(position: Position): number | undefined {
        if (!this.inside(position)) {
            return undefined
        }
        return Math.floor(position.x) + Math.floor(position.y) * this.boundary.width
    }

    public inside(position: Position): boolean {
        return position.x >= 0 && position.y >= 0 && position.x < this.boundary.width && position.y < this.boundary.height
    }

    public buildDoor(position: Position): void {
        this.set(position, doorTile())
    }

    public buildRoom(world: World, rectangle: Rectangle): number {
        const room = world.entity()
            .with("room")
            .close()
        foreach(rasterizeRectangle(rectangle, true), (p: Position) =>
            this.set(p, roomTile(room))
        )
        return room
    }

    public buildHub(world: World, rectangle: Rectangle): number {
        const room = world.entity()
            .with("room")
            .close()
        foreach(rasterizeRectangle(rectangle, true), (p: Position) =>
            this.set(p, hubTile(room))
        )
        return room
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

    public isFree(positions: Position[], roomFilter?: number): boolean {
        return positions.find(p => !this.inside(p) || this.isRoom(p, roomFilter)) === undefined
    }

    public isWalls(positions: Position[]): boolean {
        return positions.find(p => !this.inside(p) || !this.isWall(p)) === undefined
    }

    public isRoom(p: Position, roomFilter?: number): boolean {
        const tile: Tile | undefined = this.get(p)
        return tile !== undefined && tile.room !== undefined && tile.room !== roomFilter
    }

    public isWall(p: Position): boolean {
        const tile: Tile | undefined = this.get(p)
        return tile !== undefined && tile.character === "#"
    }

    public isBlocking(position: Position): boolean {
        const tile: Tile | undefined = this.get(position)
        return tile === undefined || tile.blocking
    }

    private renderTile(display: Display, position: Position, tile: Tile): void {
        if (tile.room !== undefined && tile.room === this.selectedRoom) {
            this.renderDrawable(display, position, tile, gray[3])
        } else {
            this.renderDrawable(display, position, tile)
        }
    }

    private renderDrawable(display: Display, position: Position, drawable: Drawable, bg?: string): void {
        display.draw(position.x, position.y, drawable.character, drawable.color, bg)
    }

    private tryToDrawDescription(display: Display, position: Position, description: string, alreadyDrawn: Set<number>): void {
        if (this.canDraw(position, description, alreadyDrawn)) {
            display.draw(position.x + 1, position.y, gridSymbols[0])
            for (let offset = 0; offset < description.length; offset++) {
                const p = new Position(position.x + 2 + offset, position.y)
                const index = this.index(p)
                if (index !== undefined) {
                    alreadyDrawn.add(index)
                    display.draw(p.x, p.y, description[offset], gray[0], gray[2])
                }
            }
        }
    }

    private canDraw(position: Position, text: string, alreadyDrawn: Set<number>): boolean {
        for (let offset = 0; offset < text.length; offset++) {
            const p = new Position(position.x + 2 + offset, position.y)
            const index = this.index(p)
            if (index === undefined || alreadyDrawn.has(index)) {
                return false
            }
        }
        return true
    }
}
