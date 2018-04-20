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
import { ViewportSystem, Viewport } from "@/systems/Viewport"
import { Color } from "@/rendering/Color"
import { TunnelingBuilder } from "@/map/generators/TunnelingBuilder"
import { Menu, MenuItems } from "@/systems/Menu"

interface DrawableWithData {
    position: Boxed<Position>, description: Boxed<string> | undefined, drawable: Drawable
}

interface Room {
    shape: Rectangle
}

export class Map implements GameSystem {

    public static NAME: string = "map"

    public readonly boundary: Size = new Size(2 * DEFAULT_WIDTH, 2 * DEFAULT_HEIGHT)
    public renderLayer: RenderLayer = RenderLayer.Layer1

    private map: Tile[] = []
    private reflectivityMap: number[] = []
    private fov: FOV | undefined = undefined
    private lighting: Lighting | undefined = undefined

    private ambientLight: Color = gray[1]
    private lightingEnabled: boolean = true
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

        world.registerComponent("light")
        world.registerComponent("room", new MapStorage<Room>())
        world.registerRelation("contains")
        world.registerRelation("connected")
    }

    public build(world: World): void {
        this.fov = new FOV.RecursiveShadowcasting((x, y) => this.isTranslucent(new Position(x, y)), { topology: 8 })
        this.lighting = new Lighting((x, y) => this.getReflectivity(new Position(x, y)), { passes: 1 })
        this.lighting.setFOV(this.fov)

        for (let y = 0; y < this.boundary.height; y++) {
            for (let x = 0; x < this.boundary.width; x++) {
                this.setTile(new Position(x, y), wallTile())
            }
        }

        const entrance = new Position(Math.floor(DEFAULT_WIDTH / 2), 0)
        new TunnelingBuilder(world, this)
            .startAt(entrance)
            .run()

        const lights: { entity: number, position: Boxed<Position> }[] = world
            .fetch()
            .on(t => t.hasLabel("light")).withComponents("position")
            .collect()
        this.updateLighting(lights, [Rectangle.from(new Position(0, 0), this.boundary)])
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


        const menu: Menu | undefined = world.systems.get(Menu.NAME) as Menu | undefined
        this.lightingEnabled = true
        if (menu !== undefined && menu.activeMenuItem === MenuItems.Map) {
            this.lightingEnabled = false
        }
        if (this.lightingEnabled) {
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

            const playerPosition: Boxed<Position> = world.fetch()
                .on(t => t.hasLabel("player").hasLabel("active"))
                .withComponents("position")
                .first()
                .position

            const playerTile = this.getTile(playerPosition.value)
            if (playerTile !== undefined && playerTile.room !== undefined) {
                const lights: { entity: number, position: Boxed<Position> }[] = world
                    .fetch(playerTile.room)
                    .on(t => t.both("contains").hasLabel("light"))
                    .withComponents("position")
                    .collect()
                const dirtyTiles: Rectangle[] = world
                    .fetch(playerTile.room)
                    .withComponents("room")
                    .stream()
                    .map(p => p.room.shape.grow(1))
                    .toArray()
                this.updateLighting(lights, dirtyTiles)
            }
        }
    }

    public render(world: World, display: Display): void {
        const viewport: ViewportSystem | undefined = world.systems.get(ViewportSystem.NAME) as ViewportSystem | undefined
        if (viewport !== undefined) {
            const topLeft = viewport.mapViewport.topLeft
            foreach(rasterizeRectangle(viewport.mapViewport.rectangle, true), position => {
                const tile: Tile | undefined = this.getTile(position)
                if (tile !== undefined) {
                    const mapPosition = position.subtract(topLeft)
                    this.renderTile(display, mapPosition, tile)
                }
            })

            this.drawDrawables(world, display, viewport.mapViewport)
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
            .with("drawable", new Drawable("+", primary[2]))
            .with("blocking")
            .close()
    }

    public buildRoom(world: World, rectangle: Rectangle): number {
        const light = world.entity()
            .with("light")
            .with("position", new Boxed(rectangle.mid))
            .close()
        const room = world.entity()
            .with("room", { shape: rectangle })
            .rel(r => r.with("contains").to(light).close())
            .close()
        foreach(rasterizeRectangle(rectangle, true), (p: Position) =>
            this.setTile(p, roomTile(room))
        )
        return room
    }

    public buildHub(world: World, rectangle: Rectangle): number {
        const light = world.entity()
            .with("light")
            .with("position", new Boxed(rectangle.mid))
            .close()
        const room = world.entity()
            .with("room", { shape: rectangle })
            .rel(r => r.with("contains").to(light).close())
            .close()
        foreach(rasterizeRectangle(rectangle, true), (p: Position) =>
            this.setTile(p, hubTile(room))
        )
        return room
    }

    public openCorridor(world: World): number {
        return world.entity().close()
    }

    public closeCorridor(world: World, room: number, rectangle: Rectangle): number {
        const light = world.entity()
            .with("light")
            .with("position", new Boxed(rectangle.mid))
            .close()
        return world.entity(room)
            .with("room", { shape: rectangle })
            .rel(r => r.with("contains").to(light).close())
            .close()
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

    private updateLighting(lights: { entity: number, position: Boxed<Position> }[], dirtyAreas: Rectangle[]): void {
        const dirtyTiles: Set<number> = new Set<number>()

        for (const area of dirtyAreas) {
            foreach(rasterizeRectangle(area, true), (p) => {
                const tile: Tile | undefined = this.getTile(p)
                if (tile !== undefined) {
                    for (const light of lights) {
                        if (tile.hasLight(light.entity)) {
                            tile.removeLight(light.entity)
                            dirtyTiles.add(this.index(p)!)
                        }
                    }
                }
            })
        }

        for (const light of lights) {
            this.lighting!.clearLights()
            this.lighting!.setLight(light.position.value.x, light.position.value.y, [255, 255, 255])
            this.lighting!.setFOV(this.fov!)
            this.lighting!.compute((x: number, y: number, color: [number, number, number]) => {
                const p = new Position(x, y)
                const tile: Tile | undefined = this.getTile(p)
                if (tile !== undefined) {
                    dirtyTiles.add(this.index(p)!)
                    tile.setLight(light.entity, new Color(color))
                }
            })
        }

        dirtyTiles.forEach(index => {
            const tile = this.getTileByIndex(index)
            if (tile !== undefined) {
                tile.computeColor(this.ambientLight)
            }
        })
    }


    private drawDrawables(world: World, display: Display, viewport: Viewport): void {
        const topLeft = viewport.topLeft
        const allDrawables: DrawableWithData[] = world
            .fetch()
            .on(v => v.hasLabel("drawable").hasLabel("position")
                .matchesValue("position", (p: Boxed<Position>) => viewport.rectangle.isInside(p.value))
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

        const menu: Menu | undefined = world.systems.get(Menu.NAME) as Menu | undefined
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

    private renderTile(display: Display, position: Position, tile: Tile): void {
        if (tile.room !== undefined && tile.room === this.selectedRoom) {
            this.renderDrawable(display, position, tile, gray[3].rgb)
        } else {
            this.renderDrawable(display, position, tile)
        }
    }

    private renderDrawable(display: Display, position: Position, drawable: Drawable, bg?: string): void {
        if (!this.lightingEnabled) {
            display.draw(position.x, position.y, drawable.character, drawable.diffuse.rgb, bg)
        } else {
            display.draw(position.x, position.y, drawable.character, drawable.color.rgb, bg)
        }
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
