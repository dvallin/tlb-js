import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/Game"
import { Position } from "@/geometry/Position"
import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { MapStorage, World, Boxed, PartitionedStorage, VectorStorage } from "mogwai-ecs/lib"
import { Display } from "rot-js"

import { Tile, wallTile, roomTile, hubTile, corridorTile } from "@/map/Tile"
import { Drawable } from "@/rendering/Drawable"
import { foreach } from "@/rendering"
import { Rectangle } from "@/geometry/Rectangle"
import { rasterize as rasterizeRectangle } from "@/rendering/rectangle"
import { Size } from "@/geometry/Size"
import { Input } from "@/systems/Input"
import { gridSymbols } from "@/symbols"
import { gray, primary } from "@/rendering/palettes"
import { ViewportSystem, Viewport } from "@/rendering/Viewport"
import { Color } from "@/rendering/Color"
import { TunnelingBuilder } from "@/map/generators/TunnelingBuilder"
import { MenuSystem, MenuItems } from "@/menu/Menu"
import { LightingSystem } from "@/lighting/Lighting"

interface DrawableWithData {
    position: Boxed<Position>, description: Boxed<string> | undefined, drawable: Drawable
}

interface Room {
    shape: Rectangle
}

export class MapSystem implements GameSystem {

    public static NAME: string = "map"
    public built: boolean = false

    public readonly boundary: Size = new Size(2 * DEFAULT_WIDTH, 2 * DEFAULT_HEIGHT)
    public renderLayer: RenderLayer = RenderLayer.Layer2

    private map: Tile[] = []
    private drawables: Map<number, Drawable[]> = new Map()
    private selectedRoom: number | undefined

    public register(world: World): void {
        world.registerSystem(MapSystem.NAME, this)
        world.registerComponent("drawable", new MapStorage<Drawable>())
        world.registerComponent("blocking")
        world.registerComponent("description", new MapStorage<Boxed<string>>())
        world.registerComponent("position", new PartitionedStorage(
            new VectorStorage<Boxed<Position>>(),
            (value: Position) => this.index(value) || -1
        ))

        world.registerComponent("room", new MapStorage<Room>())
        world.registerRelation("contains")
        world.registerRelation("connected")
    }

    public build(world: World): void {
        if (!this.built) {
            for (let y = 0; y < this.boundary.height; y++) {
                for (let x = 0; x < this.boundary.width; x++) {
                    this.setTile(world, new Position(x, y), wallTile())
                }
            }

            const entrance = new Position(Math.floor(DEFAULT_WIDTH / 2), 0)
            new TunnelingBuilder(world, this)
                .startAt(entrance)
                .run()

            this.built = true
        }
    }

    public execute(world: World): void {
        const input: Input | undefined = world.systems.get(Input.NAME) as Input | undefined
        const viewport: ViewportSystem | undefined = world.systems.get(ViewportSystem.NAME) as ViewportSystem | undefined
        if (input !== undefined && viewport !== undefined) {
            const mousePosition = new Position(input.mouse.x, input.mouse.y)
            const topLeft = viewport.mapViewport.topLeft
            const tile = this.getTile(mousePosition.add(topLeft))
            if (tile !== undefined) {
                this.selectedRoom = tile.room
            }
        }
        this.drawables.clear()
        world.fetch()
            .on(t => t.hasLabel("drawable").hasLabel("position"))
            .withComponents("drawable", "position")
            .stream()
            .each((v: { position: Boxed<Position>, drawable: Drawable }) => {
                const index = this.index(v.position.value)
                if (index !== undefined) {
                    if (!this.drawables.has(index)) {
                        this.drawables.set(index, [v.drawable])
                    } else {
                        this.drawables.get(index)!.push(v.drawable)
                    }
                }
            })
    }

    public render(world: World, display: Display): void {
        const viewport: ViewportSystem | undefined = world.systems.get(ViewportSystem.NAME) as ViewportSystem | undefined
        const lighting: LightingSystem | undefined = world.systems.get(LightingSystem.NAME) as LightingSystem | undefined
        if (viewport !== undefined && lighting !== undefined) {
            const topLeft = viewport.mapViewport.topLeft
            foreach(rasterizeRectangle(viewport.mapViewport.rectangle, true), position => {
                const index: number | undefined = this.index(position)
                if (index !== undefined && lighting.isDiscovered(index)) {
                    const tile: Tile = this.getTileByIndex(index)!
                    const mapPosition = position.subtract(topLeft)
                    this.renderTile(display, mapPosition, tile, lighting.getColor(tile, index))
                }
            })

            this.drawDrawables(world, display, viewport.mapViewport)
        }
    }

    public setTile(world: World, position: Position, tile: Tile): void {
        const idx = this.index(position)
        if (idx !== undefined) {
            this.map[idx] = tile

            const lighting: LightingSystem | undefined = world.systems.get(LightingSystem.NAME) as LightingSystem | undefined
            if (lighting !== undefined) {
                lighting.setDrawable(tile, idx)
            }
        }
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

    public getDrawablesByIndex(index: number): Drawable[] {
        return this.drawables.get(index) || []
    }

    public position(index: number): Position {
        return new Position(index % this.boundary.width, index / this.boundary.width)
    }

    public index(position: Position): number | undefined {
        if (!this.inside(position)) {
            return undefined
        }
        return Math.round(position.x) + Math.round(position.y) * this.boundary.width
    }

    public inside(position: Position): boolean {
        return position.x >= 0 && position.y >= 0 && position.x < this.boundary.width && position.y < this.boundary.height
    }

    public buildDoor(world: World, position: Position, room: number): void {
        this.setTile(world, position, corridorTile(room))
        world.entity()
            .with("position", new Boxed(position))
            .with("drawable", new Drawable("+", primary[2]))
            .with("lightBlocking")
            .with("blocking")
            .close()
    }

    public buildRoom(world: World, rectangle: Rectangle): number {
        const room = world.entity()
            .with("room", { shape: rectangle })
            .close()
        foreach(rasterizeRectangle(rectangle, true), (p: Position) =>
            this.setTile(world, p, roomTile(room))
        )
        this.addLightToRoom(world, room, rectangle)
        return room
    }

    public buildHub(world: World, rectangle: Rectangle): number {
        const room = world.entity()
            .with("room", { shape: rectangle })
            .close()
        foreach(rasterizeRectangle(rectangle, true), (p: Position) =>
            this.setTile(world, p, hubTile(room))
        )
        this.addLightToRoom(world, room, rectangle)
        return room
    }

    public addLightToRoom(world: World, room: number, rectangle: Rectangle): void {
        const lighting: LightingSystem | undefined = world.systems.get(LightingSystem.NAME) as LightingSystem | undefined
        if (lighting !== undefined) {
            const light = lighting.buildLight(world, rectangle.mid)
            world.entity(room).rel(r => r.with("contains").to(light).close()).close()
        }
    }

    public openCorridor(world: World): number {
        return world.entity().close()
    }

    public closeCorridor(world: World, room: number, rectangle: Rectangle): number {
        world.entity(room)
            .with("room", { shape: rectangle })
            .close()

        this.addLightToRoom(world, room, rectangle)
        return room
    }

    public buildAsset(world: World, position: Position, asset: (Tile | undefined)[]): void {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const tile: Tile | undefined = asset[4 * y + x]
                if (tile !== undefined) {
                    this.setTile(world, new Position(position.x + x - 1, position.y + y - 1), tile)
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

    private drawDrawables(world: World, display: Display, viewport: Viewport): void {
        const lighting: LightingSystem | undefined = world.systems.get(LightingSystem.NAME) as LightingSystem | undefined
        if (lighting === undefined) {
            return
        }

        const topLeft = viewport.topLeft
        const allDrawables: DrawableWithData[] = world
            .fetch()
            .on(v => v.hasLabel("drawable").hasLabel("position")
                .matchesValue("position", (p: Boxed<Position>) => {
                    const index: number | undefined = this.index(p.value)
                    if (index !== undefined && lighting.isDiscovered(index)) {
                        return viewport.rectangle.isInside(p.value)
                    } else {
                        return false
                    }
                })
            )
            .withComponents("position", "drawable", "description")
            .collect()

        const alreadyDrawn = new Set<number>()
        allDrawables.forEach((comp: DrawableWithData) => {
            const p = comp.position.value.subtract(topLeft)
            const index: number = this.index(p)!
            this.renderCharacter(display, p, comp.drawable.character, lighting.getColor(comp.drawable, index))
            alreadyDrawn.add(index)
        })

        const menu: MenuSystem | undefined = world.systems.get(MenuSystem.NAME) as MenuSystem | undefined
        if (menu !== undefined && menu.activeMenuItem === MenuItems.Map) {
            this.drawDescriptions(allDrawables, alreadyDrawn, topLeft, display)
        }
    }

    private drawDescriptions(drawables: DrawableWithData[], alreadyDrawn: Set<number>, topLeft: Position, display: Display): void {
        drawables.forEach((comp: DrawableWithData) => {
            if (comp.description !== undefined) {
                this.tryToDrawDescription(display, comp.position.value.subtract(topLeft), comp.description.value, alreadyDrawn)
            }
        })
    }

    private renderTile(display: Display, position: Position, tile: Tile, color: Color): void {
        if (tile.room !== undefined && tile.room === this.selectedRoom) {
            this.renderCharacter(display, position, tile.character, color, gray[3].rgb)
        } else {
            this.renderCharacter(display, position, tile.character, color)
        }
    }

    private renderCharacter(display: Display, position: Position, character: string, color: Color, bg?: string): void {
        display.draw(position.x, position.y, character, color.rgb, bg)
    }

    private tryToDrawDescription(display: Display, position: Position, description: string, alreadyDrawn: Set<number>): void {
        if (this.canDraw(position, description, alreadyDrawn)) {
            display.draw(position.x + 1, position.y, gridSymbols[0])
            for (let offset = 0; offset < description.length; offset++) {
                const p = new Position(position.x + 2 + offset, position.y)
                const index = this.index(p)
                if (index !== undefined) {
                    alreadyDrawn.add(index)
                    display.draw(p.x, p.y, description[offset], gray[0].rgb, gray[2].rgb)
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
