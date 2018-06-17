import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/Game"
import { Position, Domain } from "@/geometry/Position"
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
import { Vector2D } from "@/geometry/Vector2D"

export class LightingSystem implements GameSystem {

    public static NAME: string = "lighting"

    public readonly boundary: Size = new Size(2 * DEFAULT_WIDTH, 2 * DEFAULT_HEIGHT)
    public renderLayer: RenderLayer = RenderLayer.Layer3

    private lightBlocking: Set<string> = new Set()
    private entityMap: Map<string, Drawable[]> = new Map()
    private visible: Set<string> = new Set()
    private discovered: Set<string> = new Set()

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

            const lights: { entity: number, position: Boxed<Position> }[] = world
                .fetch()
                .on(t => t.hasLabel("light")).withComponents("position")
                .collect()
            const domains = new Map<Domain, { entity: number, position: Boxed<Position> }[]>()
            lights.forEach(light => {
                const domain = domains.get(light.position.value.domain) || []
                domain.push(light)
                domains.set(light.position.value.domain, domain)
            })
            domains.forEach((value, key) => {
                this.updateLighting(world, key, value, [Rectangle.from(new Vector2D(0, 0), this.boundary)])
            })
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
            const domain = playerPosition.value.domain

            const playerTile = map!.getTile(playerPosition.value)
            if (playerTile !== undefined && playerTile.room !== undefined) {
                this.visible.clear()
                const roomIds: Set<number> = new Set()
                const fov = new FOV.RecursiveShadowcasting(
                    (x, y) => this.isLightPassing(map!, new Position(domain, new Vector2D(x, y))),
                    { topology: 8 }
                )
                fov.compute(playerPosition.value.x, playerPosition.value.y, 20, (x, y) => {
                    const index = map!.getIndex(new Position(domain, new Vector2D(x, y)))
                    if (index !== undefined) {
                        this.discovered.add(index)
                        this.visible.add(index)
                        const room = map!.getTileByIndex(index)!.room
                        if (room !== undefined) {
                            roomIds.add(room)
                        }
                    }
                })

                const lights: { entity: number, position: Boxed<Position> }[] = world
                    .fetch(...Array.from(roomIds))
                    .on(t => t.out("contains").hasLabel("light"))
                    .withComponents("position")
                    .collect()
                const dirtyTiles: Rectangle[] = world
                    .fetch(...Array.from(roomIds))
                    .withComponents("room")
                    .stream()
                    .map(p => p.room.shape.grow(1))
                    .toArray()
                this.updateLighting(world, domain, lights, dirtyTiles)

            }
        }
    }

    public render({ }: World, { }: Display): void {
        //
    }

    public afterRender({ }: World): void {
        //
    }

    public buildLight(world: World, position: Position): number {
        return world.entity()
            .with("light")
            .with("position", new Boxed(position))
            .close()
    }

    public isVisible(index: string): boolean {
        return this.visible.has(index)
    }

    public isDiscovered(index: string): boolean {
        return this.discovered.has(index)
    }

    public setDrawable(drawable: Drawable): void {
        drawable.computeColor(this.ambientLight)
    }

    public isLightPassing(map: MapSystem, position: Position): boolean {
        const index: string | undefined = map.getIndex(position)
        if (index === undefined) {
            return false
        }

        const tile: Tile | undefined = map.getTileByIndex(index)
        if (tile === undefined || tile.lightBlocking) {
            return false
        }

        if (this.lightBlocking.has(index)) {
            return false
        }

        return true
    }

    public getColor(drawable: Drawable): Color {
        if (!this.lightingEnabled) {
            return drawable.diffuse
        }
        return drawable.color
    }

    private updateLighting(world: World, domain: Domain,
        lights: { entity: number, position: Boxed<Position> }[],
        dirtyAreas: Rectangle[]
    ): void {
        const map: MapSystem | undefined = world.systems.get(MapSystem.NAME) as MapSystem | undefined
        if (map === undefined) {
            return
        }

        this.lightBlocking.clear()
        world.fetch()
            .on(t => t.hasLabel("lightBlocking").hasLabel("position"))
            .withComponents("position")
            .stream()
            .each((v: { position: Boxed<Position> }) => {
                const idx = map!.getIndex(v.position.value)
                if (idx !== undefined) {
                    this.lightBlocking.add(idx)
                }
            })

        this.entityMap.clear()
        world.fetch()
            .on(t => t.hasLabel("drawable").hasLabel("position"))
            .withComponents("position", "drawable")
            .stream()
            .each((v: { position: Boxed<Position>, drawable: Drawable }) => {
                const idx = map!.getIndex(v.position.value)
                v.drawable.clearLight()
                if (idx !== undefined) {
                    if (this.entityMap.has(idx)) {
                        this.entityMap.get(idx)!.push(v.drawable)
                    } else {
                        this.entityMap.set(idx, [v.drawable])
                    }
                }
            })

        const dirtyTiles: Set<string> = new Set<string>()
        for (const area of dirtyAreas) {
            foreach(rasterizeRectangle(area, true), (v) => {
                const p: Position = new Position(domain, v)
                const tile: Tile | undefined = map.getTile(p)
                if (tile !== undefined) {
                    for (const light of lights) {
                        if (tile.hasLight(light.entity)) {
                            tile.removeLight(light.entity)
                            dirtyTiles.add(map.getIndex(p)!)
                        }
                    }
                }
            })
        }

        for (const light of lights) {
            const fov = new FOV.PreciseShadowcasting(
                (x, y) => this.isLightPassing(map, new Position(domain, new Vector2D(x, y))),
                { topology: 8 }
            )
            const lighting = new Lighting(
                (x, y) => this.isLightPassing(map, new Position(domain, new Vector2D(x, y))) ? 1.0 : 0.0,
                { passes: 1 }
            )
            lighting.setLight(light.position.value.x, light.position.value.y, [255, 255, 255])
            lighting.setFOV(fov)
            lighting.compute((x: number, y: number, c: [number, number, number]) => {
                const p = new Position(domain, new Vector2D(x, y))
                const index = map.getIndex(p)
                if (index !== undefined) {
                    const tile: Tile | undefined = map.getTileByIndex(index)
                    const color = new Color(c)
                    if (tile !== undefined) {
                        dirtyTiles.add(map.getIndex(p)!)
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
