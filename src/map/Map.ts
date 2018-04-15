import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/Game"
import { Position } from "@/geometry/Position"
import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { MapStorage, World, Boxed, PartitionedStorage, VectorStorage } from "mogwai-ecs/lib"
import { Display, FOV, Lighting } from "rot-js"

import { Tile, wallTile, roomTile, hubTile, corridorTile } from "@/map/Tile"
import { Drawable } from "@/rendering/Drawable"
import { foreach } from "@/rendering"
import { Rectangle } from "@/geometry/Rectangle"
import { rasterize as rasterizeRectangle } from "@/rendering/rectangle"
import { Size } from "@/geometry/Size"
import { Input } from "@/systems/Input"
import { gridSymbols } from "@/symbols"
import { gray, primary } from "@/rendering/palettes"
import { Viewport } from "@/systems/Viewport"
import { Color } from "@/rendering/Color"
import { TunnelingBuilder } from "@/map/generators/TunnelingBuilder"

export class Map implements GameSystem {

    public static NAME: string = "map"

    public readonly boundary: Size = new Size(2 * DEFAULT_WIDTH, 2 * DEFAULT_HEIGHT)
    public renderLayer: RenderLayer = RenderLayer.Layer1

    private map: Tile[] = []
    private reflectivityMap: number[] = []

    private ambientLight: Color = gray[1]
    private lighting: Lighting | undefined
    private selectedRoom: number | undefined

    public register(world: World): void {
        world.registerSystem(Map.NAME, this)
        world.registerComponent("drawable", new MapStorage<Drawable>())
        world.registerComponent("blocking")
        world.registerComponent("description", new MapStorage<Boxed<string>>())
        world.registerComponent("position", new PartitionedStorage(
            new VectorStorage<Boxed<Position>>(),
            (value: Position) => this.index(value) || -1
        ))

        world.registerComponent("room")
        world.registerRelation("contains")
        world.registerRelation("connected")
    }

    public build(world: World): void {
        for (let y = 0; y < this.boundary.height; y++) {
            for (let x = 0; x < this.boundary.width; x++) {
                this.setTile(new Position(x, y), wallTile())
            }
        }

        const entrance = new Position(Math.floor(DEFAULT_WIDTH / 2), 0)
        new TunnelingBuilder(world, this)
            .startAt(entrance)
            .run()

        this.lighting = new Lighting((x, y) => this.getReflectivity(new Position(x, y)), { passes: 2 })
        const fov = new FOV.PreciseShadowcasting((x, y) => this.isTranslucent(new Position(x, y)), { topology: 8 })
        this.lighting!.setFOV(fov)

        this.lighting.setLight(DEFAULT_WIDTH / 2, 3, [255, 255, 255])
    }

    public execute(world: World): void {
        const input: Input | undefined = world.systems.get(Input.NAME) as Input | undefined
        const viewport: Viewport | undefined = world.systems.get(Viewport.NAME) as Viewport | undefined
        if (input !== undefined && viewport !== undefined) {
            const mousePosition = new Position(input.mouse.x, input.mouse.y)
            const topLeft = viewport.topLeft
            const tile = this.getTile(mousePosition.add(topLeft))
            if (tile !== undefined) {
                this.selectedRoom = tile.room
            }
        }
        this.updateLighting(world)
    }

    public render(world: World, display: Display): void {
        const viewport: Viewport | undefined = world.systems.get(Viewport.NAME) as Viewport | undefined
        if (viewport !== undefined) {
            const topLeft = viewport.topLeft
            foreach(rasterizeRectangle(viewport.viewport, true), position => {
                const tile: Tile | undefined = this.getTile(position)
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

    public setTile(position: Position, tile: Tile): void {
        const idx = this.index(position)
        if (idx !== undefined) {
            this.map[idx] = tile
        }
        tile.computeColor(this.ambientLight)
    }

    public getTile(position: Position): Tile | undefined {
        const index = this.index(position)
        if (index !== undefined) {
            return this.map[index]
        }
        return undefined
    }

    public getTileByIndex(index: number): Tile | undefined {
        return this.map[index]
    }

    public position(index: number): Position {
        return new Position(index % this.boundary.width, index / this.boundary.width)
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

    public buildDoor(world: World, position: Position, room: number): void {
        this.setTile(position, corridorTile(room))
        world.entity()
            .with("position", new Boxed(position))
            .with("drawable", { character: "+", color: primary[2] })
            .with("blocking")
            .close()
    }

    public buildRoom(world: World, rectangle: Rectangle): number {
        const room = world.entity()
            .with("room")
            .close()
        foreach(rasterizeRectangle(rectangle, true), (p: Position) =>
            this.setTile(p, roomTile(room))
        )
        return room
    }

    public buildHub(world: World, rectangle: Rectangle): number {
        const room = world.entity()
            .with("room")
            .close()
        foreach(rasterizeRectangle(rectangle, true), (p: Position) =>
            this.setTile(p, hubTile(room))
        )
        return room
    }

    public buildAsset(position: Position, asset: (Tile | undefined)[]): void {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const tile: Tile | undefined = asset[4 * y + x]
                if (tile !== undefined) {
                    this.setTile(new Position(position.x + x - 1, position.y + y - 1), tile)
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
        const tile: Tile | undefined = this.getTile(p)
        return tile !== undefined && tile.room !== undefined && tile.room !== roomFilter
    }

    public isWall(p: Position): boolean {
        const tile: Tile | undefined = this.getTile(p)
        return tile !== undefined && tile.character === "#"
    }

    public isBlocking(world: World, position: Position, entityFilter: number): boolean {
        const tile: Tile | undefined = this.getTile(position)
        const tileBlocking = tile === undefined || tile.blocking
        if (tileBlocking) {
            return true
        }
        const entityBlocking = !world.fetch()
            .on(t => t
                .ofPartition("position", new Boxed(position))
                .hasLabel("blocking")
            )
            .stream()
            .filter(e => e.entity !== entityFilter)
            .isEmpty()
        if (entityBlocking) {
            return true
        }
        return false
    }

    public isTranslucent(position: Position): boolean {
        return this.getReflectivity(position) !== 0
    }

    public getReflectivity(position: Position): number {
        const idx = this.index(position)
        if (idx === undefined) {
            return 0
        }

        let reflectivity = 0
        const tile: Tile | undefined = this.getTileByIndex(idx)
        if (tile !== undefined) {
            reflectivity = tile.reflectivity
        }
        const dynamicReflectivity: number | undefined = this.reflectivityMap[idx]
        if (dynamicReflectivity !== undefined) {
            return Math.min(dynamicReflectivity, reflectivity)
        }
        return reflectivity
    }

    private updateLighting(world: World): void {
        this.reflectivityMap = []
        world.fetch()
            .on(t => t.hasLabel("blocking").hasLabel("position"))
            .withComponents("position")
            .stream()
            .each((v: { position: Boxed<Position> }) => {
                const idx = this.index(v.position.value)
                if (idx !== undefined) {
                    this.reflectivityMap[idx] = 0.0
                }
            })

        this.lighting!.reset()

        const dirtyTiles: Set<number> = new Set<number>()
        for (let y = 0; y < this.boundary.height; y++) {
            for (let x = 0; x < this.boundary.width; x++) {
                const p = new Position(x, y)
                const tile: Tile | undefined = this.getTile(p)
                if (tile !== undefined && tile.totalLight !== undefined) {
                    dirtyTiles.add(this.index(p)!)
                    tile.totalLight = undefined
                }
            }
        }

        this.lighting!.compute((x: number, y: number, color: [number, number, number]) => {
            const p = new Position(x, y)
            const tile: Tile | undefined = this.getTile(p)
            if (tile !== undefined) {
                dirtyTiles.add(this.index(p)!)
                tile.totalLight = new Color(color)
            }
        })

        dirtyTiles.forEach(index => {
            const tile = this.getTileByIndex(index)
            if (tile !== undefined) {
                tile.computeColor(this.ambientLight, tile.totalLight)
            }
        })
    }

    private renderTile(display: Display, position: Position, tile: Tile): void {
        if (tile.room !== undefined && tile.room === this.selectedRoom) {
            this.renderDrawable(display, position, tile, gray[3].hex)
        } else {
            this.renderDrawable(display, position, tile)
        }
    }

    private renderDrawable(display: Display, position: Position, drawable: Drawable, bg?: string): void {
        display.draw(position.x, position.y, drawable.character, drawable.color.hex, bg)
    }

    private tryToDrawDescription(display: Display, position: Position, description: string, alreadyDrawn: Set<number>): void {
        if (this.canDraw(position, description, alreadyDrawn)) {
            display.draw(position.x + 1, position.y, gridSymbols[0])
            for (let offset = 0; offset < description.length; offset++) {
                const p = new Position(position.x + 2 + offset, position.y)
                const index = this.index(p)
                if (index !== undefined) {
                    alreadyDrawn.add(index)
                    display.draw(p.x, p.y, description[offset], gray[0].hex, gray[2].hex)
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
