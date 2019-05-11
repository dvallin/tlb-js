import { TlbWorld, ComponentName, TlbSystem } from '../tlb'
import { Vector } from '../spatial'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { AgentComponent, Action } from '../components/agent'
import { PositionComponent } from '../components/position'
import { Entity } from '../ecs/entity'
import { createFeature, FeatureComponent } from '../components/feature'
import { leftOf, rightOf, Direction, oppositeOf } from '../spatial/direction'
import { Random } from '../random'
import { Rectangle } from '../geometry/rectangle'
import { FunctionalShape } from '../geometry/functional-shape'
import { RoomGenerator } from '../assets/room-generator'
import { Room } from '../assets/rooms'
import { dropAt } from '../array-utils'
import { createDoor, AssetType, createAssetFromPosition } from '../components/asset'
import { RegionComponent } from '../components/region'
import { Shape } from '../geometry/shape'
import { LightComponent } from '../components/light'
import { Color } from '../renderer/color'
import { FovComponent } from '../components/fov'
import { createCharacterStatsComponent, CharacterStatsComponent } from '../components/character-stats'
import { AiComponent } from '../components/ai'
import { ItemComponent, InventoryComponent, EquipmentComponent } from '../components/items'
import { HasActionComponent } from '../components/action'

export interface PositionedAgent {
  position: PositionComponent
  agent: AgentComponent
  region: RegionComponent | undefined
}

export class Agent implements TlbSystem {
  public readonly components: ComponentName[] = ['agent']

  public readonly roomGenerator: RoomGenerator

  public constructor(public random: Random, private readonly maximumAge: number = 40, private readonly maximumGenerations: number = 3) {
    this.roomGenerator = new RoomGenerator(random)
  }

  public update(world: TlbWorld, entity: Entity): void {
    const agent = world.getComponent<AgentComponent>(entity, 'agent')!
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const region = agent.allowedRegion !== undefined ? world.getComponent<RegionComponent>(agent.allowedRegion, 'region') : undefined
    this.run(world, entity, { position, agent, region })
  }

  public run(world: TlbWorld, entity: Entity, state: PositionedAgent): void {
    const action = this.createAction(world, state)
    this.takeAction(world, entity, state, action)
  }

  public createAction(world: TlbWorld, state: PositionedAgent): Action {
    let movesSinceDirectionChange = 0
    for (let i = state.agent.actions.length - 1; i >= 0; i--) {
      const action = state.agent.actions[i]
      if (action === 'move') {
        movesSinceDirectionChange++
      } else if (action === 'changeDirection') {
        break
      }
    }
    let moves = 0
    for (const action of state.agent.actions) {
      if (action === 'move') {
        moves++
      }
    }
    if (moves > this.maximumAge) {
      return 'close'
    }

    const footprint = this.footprint(state.position.position, state.agent.direction, state.agent.width)
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const canRender = map.isShapeFree(world, footprint)
    if (canRender) {
      return 'render'
    }

    const forward = this.freeCells(world, map, state, state.position.position, state.agent.direction, state.agent.width)
    if (movesSinceDirectionChange > state.agent.width && forward < 2) {
      return 'changeDirection'
    }

    if (this.random.decision(0.3)) {
      return 'createRoom'
    }

    const nextPosition = state.position.position.add(Vector.fromDirection(state.agent.direction))
    const nextFootprint = this.footprint(nextPosition, state.agent.direction, state.agent.width)
    if (!map.isShapeFree(world, nextFootprint)) {
      return 'close'
    }
    return 'move'
  }

  public takeAction(world: TlbWorld, entity: Entity, state: PositionedAgent, action: Action): void {
    state.agent.actions.push(action)
    switch (action) {
      case 'render': {
        this.render(world, state)
        break
      }
      case 'changeDirection': {
        const { position, direction } = this.changeDirection(world, state)
        world
          .editEntity(entity)
          .withComponent<AgentComponent>('agent', { ...state.agent, direction })
          .withComponent<PositionComponent>('position', { position })
        break
      }
      case 'move': {
        const position = this.move(state)
        world.editEntity(entity).withComponent<PositionComponent>('position', { position })
        break
      }
      case 'createRoom': {
        this.createRoom(world, state)
        break
      }
      case 'close': {
        world.deleteEntity(entity)
        break
      }
    }
  }

  public render(world: TlbWorld, state: PositionedAgent): void {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const footprint = this.footprint(state.position.position, state.agent.direction, state.agent.width)
    footprint.foreach(position => createFeature(world, map, position, 'corridor'))
    let moves = 0
    for (const action of state.agent.actions) {
      if (action === 'move') {
        moves++
      }
    }
    if (moves % 10 === 0) {
      this.spawnLight(world, map, state.position.position)
    }
  }

  public createRoom(world: TlbWorld, state: PositionedAgent): void {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const currentDirection = state.agent.direction
    const width = state.agent.width
    const footprint = this.footprint(state.position.position, currentDirection, width)

    const buildLeft = this.random.decision(0.5)
    const direction = buildLeft ? leftOf(currentDirection) : rightOf(currentDirection)
    let doorPosition = buildLeft ? this.leftPosition(currentDirection, footprint) : this.rightPosition(currentDirection, footprint)

    const doorWidth = this.random.integerBetween(1, 3)
    const stepBack = this.stepBack(state, doorWidth)
    doorPosition = doorPosition.add(stepBack).add(Vector.fromDirection(direction))

    const entry = this.footprint(doorPosition, direction, doorWidth)
    const room = this.roomGenerator.generate(entry, direction)
    if (this.isInRegion(state, room.shape) && map.isShapeFree(world, room.shape.grow())) {
      this.buildRoom(world, state, map, room)
    }
  }

  public buildRoom(world: TlbWorld, state: PositionedAgent, map: WorldMap, room: Room): void {
    room.shape.foreach(p => createFeature(world, map, p, 'room'))

    this.spawnLight(world, map, room.shape.bounds().center)
    this.spawnEnemy(world, map, this.random.insideRectangle(room.shape.bounds()))

    let remainingSpawns = this.random.integerBetween(0, 2)
    while (remainingSpawns-- > 0 && room.availableEntries.length > 0) {
      const exitIndex = this.random.integerBetween(0, room.availableEntries.length - 1)
      const exitSlot = room.availableEntries[exitIndex]
      const agentDirection = oppositeOf(exitSlot.direction)
      const exitWidth = this.random.integerBetween(1, 3)
      const largerShape = this.footprint(exitSlot.position, agentDirection, exitWidth + 2)
      if (map.isShapeFree(world, largerShape)) {
        dropAt(room.availableEntries, exitIndex)
        room.entries.push(this.footprint(exitSlot.position, agentDirection, exitWidth))
        if (state.agent.generation < this.maximumGenerations) {
          this.spawnAgent(world, exitSlot.position, exitWidth, agentDirection, state.agent.generation + 1, state.agent.allowedRegion)
        }
      }
    }

    room.entries.forEach(entry => {
      entry.foreach(p => createFeature(world, map, p, 'corridor'))
      createDoor(world, map, entry)
    })

    let remainingAssets = this.random.integerBetween(1, 2)
    while (remainingAssets-- > 0 && room.availableAssets.length > 0) {
      const assetIndex = this.random.integerBetween(0, room.availableAssets.length - 1)
      const assetSlot = room.availableAssets[assetIndex]
      const hasWall = map.shapeHasSome(world, FunctionalShape.lN(assetSlot.position), f => f === undefined || f.type === 'wall')

      const possibleAssets: AssetType[] = []
      if (hasWall) {
        possibleAssets.push('locker')
      }
      possibleAssets.push('trash')
      const assetType = this.random.pick<AssetType>(possibleAssets)
      dropAt(room.availableAssets, assetIndex)
      createAssetFromPosition(world, map, assetSlot.position, assetType)
    }
  }

  public move(state: PositionedAgent): Vector {
    return state.position.position.add(Vector.fromDirection(state.agent.direction))
  }

  public changeDirection(world: TlbWorld, state: PositionedAgent): { direction: Direction; position: Vector } {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const currentDirection = state.agent.direction
    const width = state.agent.width
    const footprint = this.footprint(state.position.position, currentDirection, width)
    const forward = this.freeCells(world, map, state, state.position.position, currentDirection, width)

    let leftPosition = this.leftPosition(currentDirection, footprint)
    let rightPosition = this.rightPosition(currentDirection, footprint)
    const stepBack = this.stepBack(state, width)
    rightPosition = rightPosition.add(stepBack)
    leftPosition = leftPosition.add(stepBack)

    const leftDirection = leftOf(currentDirection)
    const left = this.freeCells(world, map, state, leftPosition, leftDirection, width)

    const rightDirection = rightOf(currentDirection)
    const right = this.freeCells(world, map, state, rightPosition, rightDirection, width)

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

  public leftPosition(direction: Direction, footprint: Rectangle): Vector {
    if (direction === 'down' || direction === 'left') {
      return footprint.bottomRight
    } else {
      return footprint.topLeft
    }
  }

  public rightPosition(direction: Direction, footprint: Rectangle): Vector {
    if (direction === 'down' || direction === 'left') {
      return footprint.topLeft
    } else {
      return footprint.bottomRight
    }
  }

  public stepBack(state: PositionedAgent, width: number): Vector {
    const direction = state.agent.direction
    let length = Math.floor(width / 2)
    if (width % 2 === 0 && (direction === 'down' || direction === 'right')) {
      length--
    }
    return Vector.fromDirection(direction).mult(-length)
  }

  public freeCells(
    world: TlbWorld,
    map: WorldMap,
    state: PositionedAgent,
    position: Vector,
    direction: Direction,
    width: number,
    maxSteps: number = 10
  ): number {
    const delta = Vector.fromDirection(direction)
    let steps = 0
    let nextPosition = position.add(delta)
    let positions = this.footprint(nextPosition, direction, width + 2)
    while (this.isInRegion(state, positions) && map.isShapeFree(world, positions)) {
      steps++
      nextPosition = nextPosition.add(delta)
      positions = this.footprint(nextPosition, direction, width + 2)
      if (steps >= maxSteps) {
        break
      }
    }
    return steps
  }

  public footprint(position: Vector, direction: Direction, width: number): Rectangle {
    const delta: Vector = Vector.fromDirection(direction)
      .perpendicular()
      .abs()
    const length = Math.floor(width / 2)
    const left = position.add(delta.mult(-length))
    const right = left.add(delta.mult(width - 1))
    return Rectangle.fromBounds(left.x, right.x, left.y, right.y)
  }

  private isInRegion(state: PositionedAgent, shape: Shape): boolean {
    return state.region === undefined || state.region.shape.contains(shape)
  }

  public spawnAgent(
    world: TlbWorld,
    position: Vector,
    width: number,
    direction: Direction,
    generation: number,
    allowedRegion?: Entity
  ): void {
    world
      .createEntity()
      .withComponent<AgentComponent>('agent', {
        actions: [],
        direction,
        width,
        generation,
        allowedRegion,
      })
      .withComponent<PositionComponent>('position', {
        position,
      })
  }

  public spawnEnemy(world: TlbWorld, map: WorldMap, position: Vector): void {
    const elite = this.random.decision(0.2)

    const characterType = elite ? 'eliteGuard' : 'guard'
    const weaponType = elite ? 'nailGun' : 'rifle'

    const weapon = world.createEntity().withComponent<ItemComponent>('item', { type: weaponType }).entity

    const centeredPosition = new Vector(position.x, position.y).center
    const entity = world
      .createEntity()
      .withComponent('npc', {})
      .withComponent<FeatureComponent>('feature', { type: characterType })
      .withComponent<PositionComponent>('position', { position: centeredPosition })
      .withComponent<FovComponent>('fov', { fov: [] })
      .withComponent<AiComponent>('ai', { type: 'rushing', state: 'idle' })
      .withComponent<HasActionComponent>('has-action', { actions: ['move', 'hit', 'rush', 'endTurn'] })
      .withComponent<CharacterStatsComponent>('character-stats', createCharacterStatsComponent(characterType))
      .withComponent<InventoryComponent>('inventory', { content: [weapon] })
      .withComponent<EquipmentComponent>('equipment', { equiped: [weapon] }).entity
    map.setCharacter(position, entity)
  }

  public spawnLight(world: TlbWorld, map: WorldMap, position: Vector): void {
    const entity = world
      .createEntity()
      .withComponent<LightComponent>('light', {
        color: new Color([this.random.integerBetween(0, 255), this.random.integerBetween(0, 255), this.random.integerBetween(0, 255)]),
      })
      .withComponent<PositionComponent>('position', { position })
      .withComponent('active', {}).entity
    map.addLight(position, entity)
  }
}
