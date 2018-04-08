import { World, VectorStorage, MapStorage } from "mogwai-ecs/lib"
import { Display } from "rot-js"

import { GameSystem, RenderLayer } from "@/systems/GameSystem"

import { Position } from "@/components/Position"
import { Direction, leftOf, rightOf } from "@/components/Direction"

import { rasterize as rasterizeRectangle } from "@/rendering/rectangle"
import { foreach, toArray } from "@/rendering"

import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "@/Game"
import { bernoulli, binomialNormed, ternaryDecision, dualDecision, uniformInteger } from "@/random"
import { Rectangle } from "@/geometry/Rectangle"
import { Size } from "@/components/Size"
import { primary, gray } from "@/palettes"

export interface Drawable {
    character: string,
    color: string,
}

export class Tile implements Drawable {
    public constructor(
        public character: string,
        public color: string,
        public room: number | undefined
    ) { }
}

function wallTile(): Tile {
    return new Tile("#", gray[3], undefined)
}

function corridorTile(): Tile {
    return new Tile(".", gray[0], undefined)
}

function roomTile(room: number): Tile {
    return new Tile(".", primary[1], room)
}

function hubTile(room: number): Tile {
    return new Tile(".", primary[0], room)
}

function doorTile(): Tile {
    return new Tile("+", primary[2], undefined)
}

function tunnelerTile(): Tile {
    return new Tile("T", "red", -1)
}

const strangeSymbols: string[] = ["ƒ"]

function randomWeapon(): Drawable {
    return { color: primary[3], character: strangeSymbols[uniformInteger(0, strangeSymbols.length)] }
}

function asset(data: string[], colors: string[], palette: string[], room: number): (Tile | undefined)[] {
    const result: (Tile | undefined)[] = []
    for (let line = 0; line < data.length; line++) {
        const dataLine = data[line]
        const colorLine = colors[line]
        for (let index = 0; index < data.length; index++) {
            const character = dataLine.charAt(index)
            if (character === " ") {
                result.push(undefined)
            } else {
                const color = palette[Number.parseInt(colorLine[index])]
                result.push(new Tile(character, color, room))
            }
        }
    }
    return result
}

function machine(room: number): (Tile | undefined)[] {
    return asset([
        " ╓- ",
        "│██╕",
        "╘██│",
        " -╜ "
    ],
        [
            " 34 ",
            "4113",
            "3114",
            " 43 "
        ],
        primary, room)
}

export class Tunneler {
    public alive: boolean = true
    public roomsBuilt: number = 0

    public constructor(
        public turns: number,
        public direction: Direction,
        public width: number,
        public generation: number,
        public room: number
    ) { }
}

export class Map implements GameSystem {

    public static NAME: string = "map"

    public renderLayer: RenderLayer = RenderLayer.Layer1

    private map: Tile[] = []
    private rooms: number = 0

    public register(world: World): void {
        world.registerSystem(Map.NAME, this)
        world.registerComponent("active", new MapStorage<Tile>())
        world.registerComponent("tunneler", new MapStorage<Tunneler>())
        world.registerComponent("drawable", new MapStorage<Drawable>())
        world.registerComponent("position", new VectorStorage<Position>())
    }

    public build(world: World): void {
        for (let y = 0; y < DEFAULT_HEIGHT; y++) {
            for (let x = 0; x < DEFAULT_WIDTH; x++) {
                this.set(new Position(x, y), wallTile())
            }
        }

        const entrance = new Position(Math.floor(DEFAULT_WIDTH / 2), 0)
        world.entity()
            .with("tunneler", new Tunneler(10, Direction.South, 3, 8, this.rooms))
            .with("position", entrance)
            .close()
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

    public execute(world: World): void {
        let updated = false
        world.fetch()
            .on(v => v.hasLabel("active").hasLabel("tunneler"))
            .withComponents("position", "tunneler")
            .stream().each((comp: { entity: number, position: Position, tunneler: Tunneler }) => {
                updated = true

                this.renderTunneler(comp.tunneler, comp.position)
                if (bernoulli(0.2)) {
                    this.changeDirection(world, comp.entity, comp.tunneler, comp.position)
                }
                this.moveTunneler(world, comp.entity, comp.tunneler, comp.position)

                if (comp.tunneler.roomsBuilt >= 3) {
                    this.spawnHub(world, comp.tunneler, comp.position)
                } else {
                    this.buildRooms(world, comp.tunneler, comp.position, new Size(uniformInteger(4, 10), uniformInteger(4, 10)))
                }

                if (!comp.tunneler.alive) {
                    world.entity(comp.entity).delete()
                }
            })

        if (!updated) {
            world.fetch()
                .on(v => v.hasLabel("tunneler"))
                .withComponents("position")
                .stream().each((comp: { entity: number, position: Position }) => {
                    world.entity(comp.entity).with("active").close()
                    this.set(comp.position, wallTile())
                })
        }
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
            .stream().each((comp: { position: Position, drawable: Drawable }) => {
                this.renderDrawable(display, comp.position, comp.drawable)
            })
    }

    private moveTunneler(world: World, entity: number, tunneler: Tunneler, position: Position): void {
        const newPosition = position.add(Position.from(tunneler.direction))
        if (this.inside(newPosition)) {
            this.setTunnelerPosition(world, entity, newPosition)
        } else {
            tunneler.alive = false
        }
    }

    private changeDirection(world: World, entity: number, tunneler: Tunneler, position: Position): void {
        const forward = this.freeCells(position, tunneler.direction, tunneler.width)
        const length = -Math.floor(tunneler.width / 2)
        const savePosition = position.add(Position.from(tunneler.direction).mult(length))
        const left = this.freeCells(savePosition, leftOf(tunneler.direction), tunneler.width)
        const right = this.freeCells(savePosition, rightOf(tunneler.direction), tunneler.width)

        if (forward < left) {
            tunneler.direction = leftOf(tunneler.direction)
            this.setTunnelerPosition(world, entity, savePosition)
        } else if (forward < right) {
            tunneler.direction = rightOf(tunneler.direction)
            this.setTunnelerPosition(world, entity, savePosition)
        }
    }

    private setTunnelerPosition(world: World, entity: number, newPosition: Position): void {
        world.entity(entity).update("position", (p: Position) => p.assign(newPosition)).close()
    }

    private spawnHub(world: World, tunneler: Tunneler, position: Position): void {
        const width = 7
        const rectangle = Rectangle.from(position, new Size(width, width), tunneler.direction)
        const rasterizedRectangle = toArray(rasterizeRectangle(rectangle.grow(1), true))
        if (this.isFree(rasterizedRectangle) && tunneler.generation > 0) {
            tunneler.alive = false
            foreach(rasterizeRectangle(rectangle, true), (p: Position) =>
                this.set(p, hubTile(this.rooms))
            )
            this.spawnTunnelers(world, tunneler, rectangle.mid, Math.ceil(width / 2))

            const m = machine(this.rooms)
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    const tile: Tile | undefined = m[4 * y + x]
                    if (tile !== undefined) {
                        this.set(new Position(rectangle.mid.x + x - 1, rectangle.mid.y + y - 1), tile)
                    }
                }
            }
        }
    }

    private buildRooms(world: World, tunneler: Tunneler, position: Position, size: Size): void {
        const delta: Position = Position.from(tunneler.direction).normal()
        const [buildLeft, buildRight]: [boolean, boolean] = dualDecision(0.1, [0.4, 0.4], 0.2)
        if (buildLeft) {
            const length = -Math.ceil(tunneler.width / 2)
            const doorPosition = position.add(delta.mult(length))
            const roomPosition = doorPosition.add(delta.mult(-1))
            const direction = leftOf(tunneler.direction)
            this.buildRoom(world, roomPosition, doorPosition, size, direction, tunneler)
        }
        if (buildRight) {
            const length = Math.floor(tunneler.width / 2) + 1
            const doorPosition = position.add(delta.mult(length))
            const roomPosition = doorPosition.add(delta)
            const direction = rightOf(tunneler.direction)
            this.buildRoom(world, roomPosition, doorPosition, size, direction, tunneler)
        }
    }

    private buildRoom(
        world: World, roomPosition: Position, doorPosition: Position, size: Size, direction: Direction, tunneler: Tunneler
    ): void {
        const rectangle = Rectangle.from(roomPosition, size, direction)
        const rasterizedRectangle = toArray(rasterizeRectangle(rectangle.grow(1), true))
        if (this.isFree(rasterizedRectangle)) {
            tunneler.roomsBuilt++
            this.rooms++
            this.set(doorPosition, doorTile())
            foreach(rasterizeRectangle(rectangle, true), (p: Position) =>
                this.set(p, roomTile(this.rooms))
            )
            world.entity().with("position", rectangle.mid).with("drawable", randomWeapon()).close()
        }
    }

    private renderTunneler(tunneler: Tunneler, position: Position): void {
        const positions: Position[] = this.tunnelerMoves(tunneler.direction, tunneler.width, position)
        if (this.isFree(positions)) {
            positions.forEach(p => this.set(p, corridorTile()))
        } else {
            tunneler.alive = false
        }
    }

    private tunnelerMoves(direction: Direction, width: number, position: Position): Position[] {
        const delta: Position = Position.from(direction).normal()
        const positions: Position[] = []
        for (let i = 0; i < width; i++) {
            const length = Math.ceil(i / 2)
            const sign = (i % 2) * 2 - 1
            positions.push(position.add(delta.mult(sign * length)))
        }
        return positions
    }

    private spawnTunnelers(world: World, tunneler: Tunneler, position: Position, offset: number): void {
        const left: Position = Position.from(tunneler.direction).normal()
        const forward: Position = Position.from(tunneler.direction)

        const [spawnLeft, spawnForward, spawnRight]: [boolean, boolean, boolean] =
            ternaryDecision(0, [0.1, 0, 0.1], [0.2, 0.1, 0.2], 0.3)

        if (spawnLeft) {
            const spawnPosition = position.add(left.mult(-offset))
            this.spawnTunneler(world, spawnPosition, leftOf(tunneler.direction), tunneler)
        }
        if (spawnRight) {
            const spawnPosition = position.add(left.mult(offset))
            this.spawnTunneler(world, spawnPosition, rightOf(tunneler.direction), tunneler)
        }
        if (spawnForward) {
            const spawnPosition = position.add(forward.mult(offset))
            this.spawnTunneler(world, spawnPosition, tunneler.direction, tunneler)
        }
    }

    private spawnTunneler(world: World, position: Position, direction: Direction, tunneler: Tunneler): void {
        const newWidth = binomialNormed([0.1, 0.3, 0.5, 0.1]) + 1
        const newTurns = uniformInteger(10, 15)
        const child = new Tunneler(newTurns, direction, newWidth, tunneler.generation - 1, this.rooms)
        const positions: Position[] = this.tunnelerMoves(direction, child.width, position)
        const isWalls = this.isWalls(positions)
        if (isWalls) {
            world.entity()
                .with("tunneler", child)
                .with("position", position)
                .close()
            this.set(position, tunnelerTile())
        }
    }

    private renderPosition(display: Display, position: Position): void {
        const tile: Tile | undefined = this.get(position)
        if (tile !== undefined) {
            this.renderDrawable(display, position, tile)
        }
    }

    private freeCells(position: Position, direction: Direction, width: number, maxSteps: number = 10): number {
        const delta = Position.from(direction)
        let steps = 0
        let currentPosition = position.add(delta)
        let positions = this.tunnelerMoves(direction, width + 2, currentPosition)
        while (this.isFree(positions)) {
            steps++
            currentPosition = currentPosition.add(delta)
            positions = this.tunnelerMoves(direction, width + 2, currentPosition)
            if (steps >= maxSteps) {
                break
            }
        }
        return steps
    }

    private isFree(positions: Position[]): boolean {
        return positions.find(p => !this.inside(p) || this.hasRoomPredicate(p)) === undefined
    }

    private isWalls(positions: Position[]): boolean {
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
