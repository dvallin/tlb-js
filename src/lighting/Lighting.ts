import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/Game"
import { Position } from "@/geometry/Position"
import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { World, Boxed } from "mogwai-ecs/lib"
import { Display, FOV, Lighting } from "rot-js"

import { Tile } from "@/map/Tile"
import { foreach } from "@/rendering"
import { Rectangle } from "@/geometry/Rectangle"
import { rasterize as rasterizeRectangle } from "@/rendering/rectangle"
import { Size } from "@/geometry/Size"
import { gray } from "@/rendering/palettes"
import { Color } from "@/rendering/Color"
import { MenuSystem, MenuItems } from "@/menu/Menu"
import { MapSystem } from "@/map/Map"
import { Drawable } from "@/rendering/Drawable"

export class LightingSystem implements GameSystem {

    public static NAME: string = "lighting"

    public readonly boundary: Size = new Size(2 * DEFAULT_WIDTH, 2 * DEFAULT_HEIGHT)
    public renderLayer: RenderLayer = RenderLayer.Layer3

    private lighting: Lighting | undefined = undefined
    private lightBlocking: Set<number> = new Set()
    private entityMap: Map<number, Drawable[]> = new Map()
    private visible: Set<number> = new Set()
    private discovered: Set<number> = new Set()

    private ambientLight: Color = gray[3]
    private lightingEnabled: boolean = true

    public register(world: World): void {
        world.registerSystem(LightingSystem.NAME, this)
        world.registerComponent("light")
        world.registerComponent("lightBlocking")
        world.registerRelation("contains")
        world.registerRelation("connected")
    }

    public build(world: World): void {
        const map: MapSystem | undefined = world.systems.get(MapSystem.NAME) as MapSystem | undefined
        if (map !== undefined) {
            if (!map.built) {
                map.build(world)
            }

            this.lighting = new Lighting((x, y) => this.isLightPassing(map, new Position(x, y)) ? 1.0 : 0.0, { passes: 1 })
            const lights: { entity: number, position: Boxed<Position> }[] = world
                .fetch()
                .on(t => t.hasLabel("light")).withComponents("position")
                .collect()
            this.updateLighting(world, lights, [Rectangle.from(new Position(0, 0), this.boundary)])
        }
    }

    public execute(world: World): void {
        const menu: MenuSystem | undefined = world.systems.get(MenuSystem.NAME) as MenuSystem | undefined
        const map: MapSystem | undefined = world.systems.get(MapSystem.NAME) as MapSystem | undefined
        this.lightingEnabled = true
        if (menu !== undefined && menu.activeMenuItem === MenuItems.Map) {
            this.lightingEnabled = false
        }
        if (this.lightingEnabled) {
            const playerPosition: Boxed<Position> = world.fetch()
                .on(t => t.hasLabel("player").hasLabel("active"))
                .withComponents("position")
                .first()
                .position

            const playerTile = map!.getTile(playerPosition.value)
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
                this.updateLighting(world, lights, dirtyTiles)

                this.visible.clear()
                const fov = new FOV.RecursiveShadowcasting((x, y) => this.isLightPassing(map!, new Position(x, y)), { topology: 8 })
                fov.compute(playerPosition.value.x, playerPosition.value.y, 20, (x, y) => {
                    const index = map!.index(new Position(x, y))
                    if (index !== undefined) {
                        this.discovered.add(index)
                        this.visible.add(index)
                    }
                })
            }
        }
    }

    public render({ }: World, { }: Display): void {
        //
    }

    public buildLight(world: World, position: Position): number {
        return world.entity()
            .with("light")
            .with("position", new Boxed(position))
            .close()
    }

    public isVisible(index: number): boolean {
        return this.visible.has(index)
    }

    public isDiscovered(index: number): boolean {
        return this.discovered.has(index)
    }

    public setDrawable(drawable: Drawable, { }: number): void {
        drawable.computeColor(this.ambientLight)
    }

    public isLightPassing(map: MapSystem, position: Position): boolean {
        const index: number | undefined = map.index(position)
        if (index === undefined) {
            return false
        }

        const tile: Tile | undefined = map.getTileByIndex(index)
        if (tile !== undefined && tile.lightBlocking) {
            return false
        }

        if (this.lightBlocking.has(index)) {
            return false
        }

        return true
    }

    public getColor(drawable: Drawable, index: number): Color {
        if (!this.lightingEnabled) {
            return drawable.diffuse
        } else if (this.isVisible(index)) {
            return drawable.color
        } else {
            return drawable.noLightColor
        }
    }

    private updateLighting(world: World, lights: { entity: number, position: Boxed<Position> }[], dirtyAreas: Rectangle[]): void {
        const map: MapSystem | undefined = world.systems.get(MapSystem.NAME) as MapSystem | undefined
        if (map === undefined) {
            return
        }

        this.entityMap.clear()
        this.lightBlocking.clear()
        world.fetch()
            .on(t => t.hasLabel("lightBlocking").hasLabel("position"))
            .withComponents("position")
            .stream()
            .each((v: { position: Boxed<Position> }) => {
                const idx = map!.index(v.position.value)
                if (idx !== undefined) {
                    this.lightBlocking.add(idx)
                }
            })
        world.fetch()
            .on(t => t.hasLabel("drawable").hasLabel("position"))
            .withComponents("position", "drawable")
            .stream()
            .each((v: { position: Boxed<Position>, drawable: Drawable }) => {
                const idx = map!.index(v.position.value)
                v.drawable.clearLight()
                if (idx !== undefined) {
                    if (this.entityMap.has(idx)) {
                        this.entityMap.get(idx)!.push(v.drawable)
                    } else {
                        this.entityMap.set(idx, [v.drawable])
                    }
                }
            })

        const dirtyTiles: Set<number> = new Set<number>()

        for (const area of dirtyAreas) {
            foreach(rasterizeRectangle(area, true), (p) => {
                const tile: Tile | undefined = map.getTile(p)
                if (tile !== undefined) {
                    for (const light of lights) {
                        if (tile.hasLight(light.entity)) {
                            tile.removeLight(light.entity)
                            dirtyTiles.add(map.index(p)!)
                        }
                    }
                }
            })
        }

        const fov = new FOV.PreciseShadowcasting((x, y) => this.isLightPassing(map, new Position(x, y)), { topology: 8 })
        for (const light of lights) {
            this.lighting!.clearLights()
            this.lighting!.setLight(light.position.value.x, light.position.value.y, [255, 255, 255])
            this.lighting!.setFOV(fov)
            this.lighting!.compute((x: number, y: number, c: [number, number, number]) => {
                const p = new Position(x, y)
                const index = map.index(p)
                if (index !== undefined) {
                    const tile: Tile | undefined = map.getTileByIndex(index)
                    const color = new Color(c)
                    if (tile !== undefined) {
                        dirtyTiles.add(map.index(p)!)
                        tile.setLight(light.entity, color)
                    }
                    if (this.entityMap.has(index)) {
                        this.entityMap.get(index)!.forEach(drawable =>
                            drawable.setLight(light.entity, color)
                        )
                    }
                }
            })
        }

        dirtyTiles.forEach(index => {
            const tile = map.getTileByIndex(index)
            if (tile !== undefined) {
                tile.computeColor(this.ambientLight)
            }
            if (this.entityMap.has(index)) {
                this.entityMap.get(index)!.forEach(drawable =>
                    drawable.computeColor(this.ambientLight)
                )
            }
        })
    }
}
