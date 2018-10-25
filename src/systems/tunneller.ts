import { TlbWorld, ComponentName, TlbSystem } from "../tlb"
import { Vector } from "../spatial"
import { WorldMap } from "../resources/world-map"
import { TunnellerComponent, Action } from "../components/tunneller"
import { PositionComponent } from "../components/position"
import { Entity } from "../ecs/entity"
import { FeatureType, FeatureComponent } from "../components/feature"
import { leftOf, rightOf, Direction } from "../spatial/direction"
import { Random } from "../random"
import { Rectangle } from "../geometry/rectangle"

export interface PositionedTunneller {
    position: PositionComponent
    tunneller: TunnellerComponent
}

export class Tunneller implements TlbSystem {

    public readonly components: ComponentName[] = ["tunneller"]

    public constructor(
        public random: Random,
        private readonly maximumAge: number = 70
    ) { }

    public update(world: TlbWorld, entity: number): void {
        const tunneller = world.getComponent<TunnellerComponent>(entity, "tunneller")
        const position = world.getComponent<PositionComponent>(entity, "position")
        if (tunneller && position) {
            this.run(world, entity, { position, tunneller })
        }
    }

    public run(world: TlbWorld, entity: Entity, state: PositionedTunneller): void {
        const action = this.createAction(world, state)
        this.takeAction(world, entity, state, action)
    }

    public takeAction(world: TlbWorld, entity: Entity, state: PositionedTunneller, action: Action): void {
        state.tunneller.actions.push(action)
        switch (action) {
            case "render": {
                this.render(world, state)
                break
            }
            case "changeDirection": {
                const { position, direction } = this.changeDirection(world, state)
                world.editEntity(entity)
                    .withComponent<TunnellerComponent>("tunneller", { ...state.tunneller, direction, })
                    .withComponent<PositionComponent>("position", { position })
                break
            }
            case "move": {
                const position = this.move(state)
                world.editEntity(entity)
                    .withComponent<PositionComponent>("position", { position })
                break
            }
            case "createRoom": {
                this.createRoom(world, state)
                break
            }
            case "close": {
                world.deleteEntity(entity)
                break
            }
        }
    }

    public createAction(world: TlbWorld, state: PositionedTunneller): Action {
        let movesSinceDirectionChange = 0
        for (let i = state.tunneller.actions.length - 1; i >= 0; i--) {
            const action = state.tunneller.actions[i]
            if (action === "move") {
                movesSinceDirectionChange++
            } else if (action === "changeDirection") {
                break
            }
        }
        let moves = 0
        for (const action of state.tunneller.actions) {
            if (action === "move") {
                moves++
            }
        }
        if (moves > this.maximumAge) {
            return "close"
        }

        const footprint = this.footprint(state.position.position, state.tunneller.direction, state.tunneller.width)
        const map = world.getResource<WorldMap>("map")
        const canRender = map.isShapeFree(world, footprint)
        if (canRender) {
            return "render"
        }

        if (movesSinceDirectionChange > state.tunneller.width && this.random.decision(0.3)) {
            // take a feature action
            if (this.random.decision(0.3)) {
                return "changeDirection"
            } else {
                return "createRoom"
            }
        }

        const nextPosition = state.position.position.add(Vector.fromDirection(state.tunneller.direction))
        const nextFootprint = this.footprint(nextPosition, state.tunneller.direction, state.tunneller.width)
        if (!map.isShapeFree(world, nextFootprint)) {
            return "close"
        }

        return "move"
    }

    public render(world: TlbWorld, state: PositionedTunneller): void {
        const map = world.getResource<WorldMap>("map")
        const footprint = this.footprint(state.position.position, state.tunneller.direction, state.tunneller.width)
        footprint.foreach(position => this.createTile(world, map, position, "corridor"))
    }

    public createRoom({ }: TlbWorld, { }: PositionedTunneller): void {
        return
    }

    public move(state: PositionedTunneller): Vector {
        return state.position.position.add(Vector.fromDirection(state.tunneller.direction))
    }

    public changeDirection(world: TlbWorld, state: PositionedTunneller): { direction: Direction, position: Vector } {
        const map = world.getResource<WorldMap>("map")
        const currentDirection = state.tunneller.direction
        const width = state.tunneller.width
        const footprint = this.footprint(state.position.position, currentDirection, width)
        const forward = this.freeCells(world, map, state.position.position, currentDirection, width)

        let length = Math.floor(state.tunneller.width / 2)
        if (width % 2 === 0 && (currentDirection === "down" || currentDirection === "right")) {
            length--
        }

        let leftPosition
        let rightPosition
        if (currentDirection === "down" || currentDirection === "left") {
            leftPosition = footprint.bottomRight
            rightPosition = footprint.topLeft
        } else {
            leftPosition = footprint.topLeft
            rightPosition = footprint.bottomRight
        }
        const delta = Vector.fromDirection(currentDirection).mult(-length)
        rightPosition = rightPosition.add(delta)
        leftPosition = leftPosition.add(delta)

        const leftDirection = leftOf(currentDirection)
        const left = this.freeCells(world, map, leftPosition, leftDirection, width)

        const rightDirection = rightOf(currentDirection)
        const right = this.freeCells(world, map, rightPosition, rightDirection, width)

        let direction = currentDirection
        let position = state.position.position

        if (forward <= Math.max(left, right)) {
            if (right < left) {
                direction = leftDirection
                position = leftPosition
            } else {
                direction = rightDirection
                position = rightPosition
            }
        }
        return { position, direction }
    }

    private freeCells(
        world: TlbWorld, map: WorldMap,
        position: Vector, direction: Direction, width: number, maxSteps: number = 10
    ): number {
        const delta = Vector.fromDirection(direction)
        let steps = 0
        let nextPosition = position.add(delta)
        let positions = this.footprint(nextPosition, direction, width + 2)
        while (map.isShapeFree(world, positions)) {
            steps++
            nextPosition = nextPosition.add(delta)
            positions = this.footprint(nextPosition, direction, width + 2)
            if (steps >= maxSteps) {
                break
            }
        }
        return steps
    }

    private footprint(position: Vector, direction: Direction, width: number): Rectangle {
        const delta: Vector = Vector.fromDirection(direction).perpendicular().abs()
        const length = Math.floor(width / 2)
        const left = position.add(delta.mult(-length))
        const right = left.add(delta.mult(width - 1))
        return Rectangle.fromBounds(left.x, right.x, left.y, right.y)
    }

    private createTile(world: TlbWorld, map: WorldMap, position: Vector, type: FeatureType): void {
        let e = map.tiles.get(position)
        if (e === undefined) {
            e = world.createEntity().entity
        }
        world.editEntity(e)
            .withComponent<PositionComponent>("position", { position })
            .withComponent<FeatureComponent>("feature", { type })
        map.tiles.set(position, e)
    }
}
