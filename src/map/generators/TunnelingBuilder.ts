import { Direction, leftOf, rightOf } from "@/geometry/Direction"
import { Position } from "@/geometry/Position"
import { Size } from "@/geometry/Size"
import { Rectangle } from "@/geometry/Rectangle"
import { bernoulli, binomialNormed, dualDecision, ternaryDecision, uniformInteger } from "@/random"
import { toArray } from "@/rendering"
import { MapStorage, World, Boxed } from "mogwai-ecs/lib"

import { rasterize as rasterizeRectangle } from "@/rendering/rectangle"
import { machine, tunnelerTile, wallTile, corridorTile, randomWeapon } from "@/map/Tile"
import { Map } from "@/map/Map"

class Tunneler {
    public alive: boolean = true
    public roomsBuilt: number = 0

    public constructor(
        public turns: number,
        public direction: Direction,
        public width: number,
        public generation: number,
        public room: number,
        public startPosition: Position
    ) { }
}

export class TunnelingBuilder {

    public constructor(private world: World, private map: Map) {
        this.world.registerComponent("tunneler", new MapStorage<Tunneler>())
    }

    public startAt(entrance: Position): TunnelingBuilder {
        const room = this.map.openCorridor(this.world)
        this.world.entity()
            .with("tunneler", new Tunneler(10, Direction.South, 3, 14, room, entrance))
            .with("position", new Boxed<Position>(entrance))
            .close()
        return this
    }

    public run(): void {
        let tunellersLeft = true
        while (tunellersLeft) {
            const updated = this.doStep()
            if (!updated) {
                tunellersLeft = this.awakeNextGeneration()
            }
        }
    }

    public doStep(): boolean {
        let updated = false
        this.world.fetch()
            .on(v => v.hasLabel("active").hasLabel("tunneler"))
            .withComponents("position", "tunneler")
            .stream().each((comp: { entity: number, position: Boxed<Position>, tunneler: Tunneler }) => {
                updated = true

                this.renderTunneler(comp.tunneler, comp.position.value)
                if (bernoulli(0.2)) {
                    this.changeDirection(comp.tunneler, comp.position)
                }
                this.moveTunneler(comp.tunneler, comp.position)

                if (bernoulli(Math.min(comp.tunneler.roomsBuilt / 7, 0.5))) {
                    this.spawnHub(comp.tunneler, comp.position.value)
                } else {
                    this.buildRooms(comp.tunneler, comp.position.value, new Size(uniformInteger(4, 10), uniformInteger(4, 10)))
                }

                if (!comp.tunneler.alive) {
                    this.closeTunneler(comp.tunneler, comp.position.value)
                    this.world.entity(comp.entity).delete()
                }
            })
        return updated
    }

    public awakeNextGeneration(): boolean {
        let updated = false
        this.world.fetch()
            .on(v => v.hasLabel("tunneler"))
            .withComponents("position", "tunneler")
            .stream().each((comp: { entity: number, position: Boxed<Position>, tunneler: Tunneler }) => {
                updated = true
                this.world.entity(comp.entity).with("active").close()
                this.map.setTile(comp.position.value, wallTile())
            })
        return updated
    }

    private buildRooms(tunneler: Tunneler, position: Position, size: Size): void {
        const delta: Position = Position.from(tunneler.direction).normal()
        const [buildLeft, buildRight]: [boolean, boolean] = dualDecision(0.1, [0.4, 0.4], 0.2)
        if (buildLeft) {
            const length = -Math.ceil(tunneler.width / 2)
            const doorPosition = position.add(delta.mult(length))
            const roomPosition = doorPosition.add(delta.mult(-1))
            const direction = leftOf(tunneler.direction)
            const rectangle = Rectangle.from(roomPosition, size, direction)
            this.buildRoom(tunneler, rectangle, doorPosition)
        }
        if (buildRight) {
            const length = Math.floor(tunneler.width / 2) + 1
            const doorPosition = position.add(delta.mult(length))
            const roomPosition = doorPosition.add(delta)
            const direction = rightOf(tunneler.direction)
            const rectangle = Rectangle.from(roomPosition, size, direction)
            this.buildRoom(tunneler, rectangle, doorPosition)
        }
    }

    private closeTunneler(tunneler: Tunneler, position: Position): void {
        const dx = Math.abs(tunneler.startPosition.x - position.x)
        const dy = Math.abs(tunneler.startPosition.y - position.y)
        let size: Size
        if (dx === 0) {
            size = new Size(tunneler.width, dy)
        } else {
            size = new Size(dx, tunneler.width)
        }
        const rectangle = Rectangle.from(tunneler.startPosition, size, tunneler.direction)
        this.map.closeCorridor(this.world, tunneler.room, rectangle)
    }

    private buildRoom(tunneler: Tunneler, rectangle: Rectangle, doorPosition: Position): void {
        const rasterizedRectangle = toArray(rasterizeRectangle(rectangle.grow(1), true))
        if (this.map.isFree(rasterizedRectangle)) {
            tunneler.roomsBuilt++
            this.map.buildDoor(this.world, doorPosition, tunneler.room)

            const room = this.map.buildRoom(this.world, rectangle)
            this.world.relation().with("connected").from(tunneler.room).to(room).close()

            const weapon = this.world.entity()
                .with("position", new Boxed<Position>(rectangle.mid))
                .with("drawable", randomWeapon())
                .with("description", new Boxed("a weapon"))
                .close()

            this.world.relation()
                .with("contains")
                .from(room)
                .to(weapon)
                .close()
        }
    }

    private renderTunneler(tunneler: Tunneler, position: Position): void {
        const positions: Position[] = this.tunnelerMoves(tunneler.direction, tunneler.width, position)
        if (this.map.isFree(positions)) {
            positions.forEach(p => this.map.setTile(p, corridorTile(tunneler.room)))
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

    private spawnTunnelers(tunneler: Tunneler, hub: number, position: Position, offset: number): void {
        const left: Position = Position.from(tunneler.direction).normal()
        const forward: Position = Position.from(tunneler.direction)

        const [spawnLeft, spawnForward, spawnRight]: [boolean, boolean, boolean] =
            ternaryDecision(0, [0.1, 0, 0.1], [0.2, 0.1, 0.2], 0.3)

        if (spawnLeft) {
            const spawnPosition = position.add(left.mult(-offset))
            this.spawnTunneler(spawnPosition, hub, leftOf(tunneler.direction), tunneler)
        }
        if (spawnRight) {
            const spawnPosition = position.add(left.mult(offset))
            this.spawnTunneler(spawnPosition, hub, rightOf(tunneler.direction), tunneler)
        }
        if (spawnForward) {
            const spawnPosition = position.add(forward.mult(offset))
            this.spawnTunneler(spawnPosition, hub, tunneler.direction, tunneler)
        }
    }

    private spawnTunneler(position: Position, hub: number, direction: Direction, tunneler: Tunneler): void {
        const newWidth = binomialNormed([0.1, 0.3, 0.5, 0.1]) + 1
        const newTurns = uniformInteger(10, 15)
        const positions: Position[] = this.tunnelerMoves(direction, newWidth, position)
        const isWalls = this.map.isWalls(positions)
        if (isWalls) {
            const room = this.map.openCorridor(this.world)
            this.world.relation().with("connected").from(hub).to(room).close()

            const child = new Tunneler(newTurns, direction, newWidth, tunneler.generation - 1, room, position)
            this.world.entity()
                .with("tunneler", child)
                .with("position", new Boxed<Position>(position))
                .close()
            this.map.setTile(position, tunnelerTile())
        }
    }

    private moveTunneler(tunneler: Tunneler, position: Boxed<Position>): void {
        const newPosition = position.value.add(Position.from(tunneler.direction))
        if (this.map.inside(newPosition)) {
            position.value = newPosition
        } else {
            tunneler.alive = false
        }
    }

    private changeDirection(tunneler: Tunneler, position: Boxed<Position>): void {
        const forward = this.freeCells(position.value, tunneler.direction, tunneler.width)

        const length = -Math.floor(tunneler.width / 2)
        const savePosition = position.value.add(Position.from(tunneler.direction).mult(length))
        const left = this.freeCells(savePosition, leftOf(tunneler.direction), tunneler.width)
        const right = this.freeCells(savePosition, rightOf(tunneler.direction), tunneler.width)

        if (forward < Math.max(left, right)) {
            position.value = savePosition

            if (forward < left) {
                tunneler.direction = leftOf(tunneler.direction)
            } else {
                tunneler.direction = rightOf(tunneler.direction)
            }
        }
    }

    private spawnHub(tunneler: Tunneler, position: Position): void {
        const width = 7
        const rectangle = Rectangle.from(position, new Size(width, width), tunneler.direction)
        const rasterizedRectangle = toArray(rasterizeRectangle(rectangle.grow(1), true))
        if (this.map.isFree(rasterizedRectangle, tunneler.room) && tunneler.generation > 0) {
            tunneler.alive = false

            const room = this.map.buildHub(this.world, rectangle)
            this.world.relation().with("connected").from(tunneler.room).to(room).close()

            this.spawnTunnelers(tunneler, room, rectangle.mid, Math.ceil(width / 2))

            const m = machine(room)
            this.map.buildAsset(rectangle.mid, m)
        }
    }

    private freeCells(position: Position, direction: Direction, width: number, maxSteps: number = 10): number {
        const delta = Position.from(direction)
        let steps = 0
        let currentPosition = position.add(delta)
        let positions = this.tunnelerMoves(direction, width + 2, currentPosition)
        while (this.map.isFree(positions)) {
            steps++
            currentPosition = currentPosition.add(delta)
            positions = this.tunnelerMoves(direction, width + 2, currentPosition)
            if (steps >= maxSteps) {
                break
            }
        }
        return steps
    }
}
