import { Position, Domain } from "@/geometry/Position"
import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { MapStorage, World, Boxed, PartitionedStorage, VectorStorage } from "mogwai-ecs/lib"
import { Display } from "rot-js"

import { Tile, wallTile, roomTile, hubTile, corridorTile } from "@/map/Tile"
import { Drawable } from "@/rendering/Drawable"
import { foreach, toArray } from "@/rendering"
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
import { doorTrigger, Trigger } from "@/triggers/TriggerSystem"
import { Vector } from "@/geometry/Vector"
import { Vector2D } from "@/geometry/Vector2D"
import { GameSettings } from "@/Game";

interface DrawableWithData {
    position: Boxed<Position>, description: Boxed<string> | undefined, drawable: Drawable
}

interface Room {
    shape: Rectangle
}

export class SparseMap<T> {
    private map: { [index: string]: T } = {}

    public constructor(
        private boundary: Vector
    ) { }

    public set(position: Position, value: T): boolean {
        const index = this.index(position)
        if (index === undefined) {
            return false
        }
        this.map[index] = value
        return true
    }

    public get(position: Position): T | undefined {
        const index = this.index(position)
        if (index === undefined) {
            return undefined
        }
        return this.getByIndex(index)
    }

    public getByIndex(index: string): T | undefined {
        return this.map[index]
    }

    public index(position: Position): string | undefined {
        if (!this.inside(position)) {
            return undefined
        }
        return position.index()
    }

    public inside(position: Position): boolean {
        return position.inside(this.boundary)
    }
}

export class MapSystem implements GameSystem {

    public static NAME: string = "map"

    public static fromSettings(settings: GameSettings): MapSystem {
        return new MapSystem(settings.map_width, settings.map_height)
    }

    public built: boolean = false

    public readonly boundary: Size
    public renderLayer: RenderLayer

    private map: SparseMap<Tile>
    private drawables: Map<string, Drawable[]>
    private selectedRoom: number | undefined
    private activeDomain: Domain | undefined

    private constructor(width: number, height: number) {
        this.boundary = new Size(width, height)
        this.map = new SparseMap(this.boundary)
        this.renderLayer = RenderLayer.Layer2
        this.drawables = new Map()
    }

    public register(world: World): void {
        world.registerSystem(MapSystem.NAME, this)
        world.registerComponent("drawable", new MapStorage<Drawable>())
        world.registerComponent("blocking")
        world.registerComponent("active", new MapStorage<Tile>())
        world.registerComponent("description", new MapStorage<Boxed<string>>())
        world.registerComponent("trigger", new MapStorage<Trigger>())
        world.registerComponent("position", new PartitionedStorage(
            new VectorStorage<Boxed<Position>>(),
            (value: Position) => this.map.index(value) || ""
        ))

        world.registerComponent("room", new MapStorage<Room>())
        world.registerRelation("contains")
        world.registerRelation("connected")
        world.registerComponent("light")
        world.registerComponent("lightBlocking")
    }

    public build(world: World): void {
        if (!this.built) {
            this.activeDomain = Domain.Tower
            const entrance = new Position(this.activeDomain, new Vector2D(Math.floor(this.boundary.width / 2), 0))
            new TunnelingBuilder(world, this)
                .startAt(entrance)
                .run()
            this.fillWalls(this.activeDomain!)
            this.built = true
        }
    }

    public execute(world: World): void {
        const input: Input | undefined = world.systems.get(Input.NAME) as Input | undefined
        const viewport: ViewportSystem | undefined = world.systems.get(ViewportSystem.NAME) as ViewportSystem | undefined

        const playerPosition: Boxed<Position> = world.fetch()
            .on(t => t.hasLabel("player").hasLabel("active"))
            .withComponents("position")
            .first()
            .position
        this.activeDomain = playerPosition.value.domain

        if (input !== undefined && viewport !== undefined) {
            const mousePosition = new Vector2D(input.mouse.x, input.mouse.y)
            const topLeft = viewport.mapViewport.topLeft
            const tile = this.getTile(new Position(this.activeDomain, mousePosition.add(topLeft)))
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
                const index = this.map.index(v.position.value)
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
            foreach(rasterizeRectangle(viewport.mapViewport.rectangle, true), v => {
                const position = new Position(this.activeDomain!, v)
                const index: string | undefined = this.map.index(position)
                if (index !== undefined && lighting.isDiscovered(index)) {
                    const tile: Tile | undefined = this.getTileByIndex(index)
                    if (tile !== undefined) {
                        const mapPosition = position.subtract(topLeft)
                        const color = lighting.getColor(tile, index)
                        this.renderTile(display, mapPosition, tile, color)
                    }
                }
            })

            this.drawDrawables(world, display, viewport.mapViewport)
        }
    }

    public afterRender({ }: World): void {
        //
    }

    public setTile(world: World, position: Position, tile: Tile): void {
        const valid = this.map.set(position, tile)
        if (valid) {
            const lighting: LightingSystem | undefined = world.systems.get(LightingSystem.NAME) as LightingSystem | undefined
            if (lighting !== undefined) {
                lighting.setDrawable(tile)
            }
        }
    }

    public getTile(position: Position): Tile | undefined {
        return this.map.get(position)
    }

    public getIndex(position: Position): string | undefined {
        return this.map.index(position)
    }

    public isInside(position: Position): boolean {
        return this.map.inside(position)
    }

    public getTileByIndex(index: string): Tile | undefined {
        return this.map.getByIndex(index)
    }

    public getDrawablesByIndex(index: string): Drawable[] {
        return this.drawables.get(index) || []
    }

    public buildDoor(world: World, position: Position, room: number): void {
        this.setTile(world, position, corridorTile(room))
        world.entity()
            .with("position", new Boxed(position))
            .with("drawable", new Drawable("+", primary[2]))
            .with("description", new Boxed("a door"))
            .with("lightBlocking")
            .with("blocking")
            .with("trigger", doorTrigger)
            .close()
    }

    public buildRoom(world: World, rectangle: Rectangle): number {
        const room = world.entity()
            .with("room", { shape: rectangle })
            .close()
        foreach(rasterizeRectangle(rectangle, true), (p: Vector2D) =>
            this.setTile(world, new Position(this.activeDomain!, p), roomTile(room))
        )
        this.addLightToRoom(world, room, rectangle)
        return room
    }

    public buildHub(world: World, rectangle: Rectangle): number {
        const room = world.entity()
            .with("room", { shape: rectangle })
            .close()
        foreach(rasterizeRectangle(rectangle, true), (p: Vector2D) =>
            this.setTile(world, new Position(this.activeDomain!, p), hubTile(room))
        )
        this.addLightToRoom(world, room, rectangle)
        return room
    }

    public addLightToRoom(world: World, room: number, rectangle: Rectangle): void {
        const lighting: LightingSystem | undefined = world.systems.get(LightingSystem.NAME) as LightingSystem | undefined
        if (lighting !== undefined) {
            const light = lighting.buildLight(world, new Position(this.activeDomain!, rectangle.mid))
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
                    this.setTile(world, new Position(this.activeDomain!, new Vector2D(position.x + x - 1, position.y + y - 1)), tile)
                }
            }
        }
    }

    public isFree(positions: Position[], roomFilter?: number): boolean {
        return positions.find(p => !this.isInside(p) || this.isRoom(p, roomFilter)) === undefined
    }

    public isWalls(positions: Position[]): boolean {
        return positions.find(p => !this.isInside(p) || !this.isWall(p)) === undefined
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

    private fillWalls(domain: Domain): void {
        const neighbours = toArray(rasterizeRectangle(Rectangle.from(new Vector2D(-1, -1), new Size(2, 2)), true))
        const newWallPositions: Vector2D[] = []
        foreach(rasterizeRectangle(Rectangle.from(new Vector2D(0, 0), this.boundary), true), (p: Vector2D) => {
            if (this.map.get(new Position(domain, p)) === undefined) {
                const firstDefinedTile = neighbours.find(offset =>
                    this.map.get(new Position(domain, p.add(offset))) !== undefined
                )
                if (firstDefinedTile !== undefined) {
                    newWallPositions.push(p)
                }
            }
        })
        newWallPositions.forEach(p => this.map.set(new Position(domain, p), wallTile()))
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
                    const index: string | undefined = this.getIndex(p.value)
                    if (index !== undefined && lighting.isDiscovered(index)) {
                        return viewport.rectangle.isInside(p.value.toVector2D())
                    } else {
                        return false
                    }
                })
            )
            .withComponents("position", "drawable", "description")
            .collect()

        const alreadyDrawn = new Set<string>()
        allDrawables.forEach((comp: DrawableWithData) => {
            const p = comp.position.value.subtract(topLeft)
            const index: string = this.getIndex(p)!
            const color = lighting.getColor(comp.drawable)
            this.renderCharacter(display, p, comp.drawable.character, color)
            alreadyDrawn.add(index)
        })

        const menu: MenuSystem | undefined = world.systems.get(MenuSystem.NAME) as MenuSystem | undefined
        if (menu !== undefined && menu.activeMenuItem === MenuItems.Map) {
            this.drawDescriptions(allDrawables, alreadyDrawn, topLeft, display)
        }
    }

    private drawDescriptions(drawables: DrawableWithData[], alreadyDrawn: Set<string>, topLeft: Vector2D, display: Display): void {
        drawables.forEach((comp: DrawableWithData) => {
            if (comp.description !== undefined) {
                this.tryToDrawDescription(display,
                    comp.position.value.toVector2D().subtract(topLeft),
                    comp.description.value,
                    alreadyDrawn
                )
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

    private tryToDrawDescription(display: Display, position: Vector2D, description: string, alreadyDrawn: Set<string>): void {
        if (this.canDraw(position, description, alreadyDrawn)) {
            display.draw(position.x + 1, position.y, gridSymbols[0])
            for (let offset = 0; offset < description.length; offset++) {
                const p = new Position(this.activeDomain!, new Vector2D(position.x + 2 + offset, position.y))
                const index = this.getIndex(p)
                if (index !== undefined) {
                    alreadyDrawn.add(index)
                    display.draw(p.x, p.y, description[offset], gray[0].rgb, gray[2].rgb)
                }
            }
        }
    }

    private canDraw(position: Vector2D, text: string, alreadyDrawn: Set<string>): boolean {
        for (let offset = 0; offset < text.length; offset++) {
            const p = new Position(this.activeDomain!, new Vector2D(position.x + 2 + offset, position.y))
            const index = this.getIndex(p)
            if (index === undefined || alreadyDrawn.has(index)) {
                return false
            }
        }
        return true
    }
}
