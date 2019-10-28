import { createFeatureFromType } from '../components/feature'
import { RegionComponent, StructureComponent } from '../components/region'
import { Entity } from '../ecs/entity'
import { Intersection } from '../geometry/intersection'
import { Rectangle } from '../geometry/rectangle'
import { Shape } from '../geometry/shape'
import { Random } from '../random'
import { Distribution, Exponential } from '../random/distributions'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { Vector } from '../spatial'
import { directions } from '../spatial/direction'
import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { shapeOfAsset, createAssetFromShape } from '../components/asset'
import { regionParams } from '../assets/complexes'
import { embedComplexes, ComplexEmbedding } from '../generative/complex-embedder'
import { fill } from '../generative/complex-filler'

interface Corridor {
  entity: Entity | undefined
  kind: 'corridor'
  shape: Shape
  exits: Corridor[]
  rooms: Room[]
}

interface Room {
  entity: Entity | undefined
  kind: 'room'
  shape: Shape
  rooms: Room[]
}

export class RegionCreator implements TlbSystem {
  public readonly components: ComponentName[] = ['active', 'region']

  private readonly uniform: Random
  private readonly exponential: Random

  public constructor(rng: Distribution) {
    this.uniform = new Random(rng)
    this.exponential = new Random(new Exponential(rng))
  }

  public update(world: TlbWorld, entity: Entity): void {
    const region = world.getComponent<RegionComponent>(entity, 'region')!

    const structure = this.planStructure(region.shape, 6, 10, 3) as Corridor
    const rootStructure = this.createCorridor(world, entity, structure, undefined)
    const embeddings = this.findEmbedding(world, entity, rootStructure)

    if (embeddings !== undefined) {
      const map = world.getResource<WorldMapResource>('map')

      this.renderCorridors(world, map, entity, region.level, structure)
      this.renderRooms(world, map, entity, region.level, structure)

      embeddings.forEach(e => fill(world, map, region.level, e.embedding, this.uniform, e.structure))

      region.entry = structure.shape.bounds().centerLeft
      world.editEntity(entity).removeComponent('active')
    } else {
      this.removeStructures(world, entity)
    }
  }

  private planStructure(shape: Shape, minRoomWidth: number, maxRoomWidth: number, corridorWidth: number): Corridor | Room {
    const bounds = shape.bounds()

    const canCorridorSplit = this.canSplit(bounds, side => this.canCorridorSplit(side, maxRoomWidth, corridorWidth))
    const canRoomSplit = this.canSplit(bounds, side => this.canRoomSplit(side, minRoomWidth))
    if (canCorridorSplit.length > 0) {
      return this.corridorSplit(shape, minRoomWidth, maxRoomWidth, corridorWidth, this.uniform.pick(canCorridorSplit))
    } else if (canRoomSplit.length > 0) {
      return this.roomSplit(shape, minRoomWidth, this.uniform.pick(canRoomSplit))
    } else {
      return {
        entity: undefined,
        kind: 'room',
        shape: shape,
        rooms: [],
      }
    }
  }

  private canSplit(rectangle: Rectangle, splitter: (side: number) => boolean): ('x' | 'y')[] {
    const split: ('x' | 'y')[] = []
    if (splitter(rectangle.width)) {
      split.push('x')
    }
    if (splitter(rectangle.height)) {
      split.push('y')
    }
    return split
  }

  private canCorridorSplit(side: number, width: number, corridorWidth: number) {
    return side >= 2 * width + corridorWidth
  }

  private canRoomSplit(side: number, width: number) {
    return side >= 2 * width
  }

  private corridorSplit(shape: Shape, minRoomWidth: number, maxRoomWidth: number, corridorWidth: number, axis: 'x' | 'y'): Corridor {
    const bounds = shape.bounds()
    const side = axis === 'x' ? bounds.width : bounds.height
    const split = this.uniform.integerBetween(maxRoomWidth, side - maxRoomWidth)
    const splitMask = this.split3(bounds, axis, split, 3)

    const leftShape = new Intersection(shape, splitMask[0])
    const corridorShape = new Intersection(shape, splitMask[1])
    const rightShape = new Intersection(shape, splitMask[2])

    const left = this.planStructure(leftShape, minRoomWidth, maxRoomWidth, corridorWidth)
    const right = this.planStructure(rightShape, minRoomWidth, maxRoomWidth, corridorWidth)

    const exits: Corridor[] = []
    const rooms: Room[] = []
    if (left.kind === 'room') {
      rooms.push(left)
    } else {
      exits.push(left)
    }
    if (right.kind === 'room') {
      rooms.push(right)
    } else {
      exits.push(right)
    }

    return {
      entity: undefined,
      kind: 'corridor',
      shape: corridorShape,
      exits,
      rooms,
    }
  }

  private roomSplit(shape: Shape, minRoomWidth: number, axis: 'x' | 'y'): Room {
    const bounds = shape.bounds()
    const side = axis === 'x' ? bounds.width : bounds.height
    const split = this.uniform.integerBetween(minRoomWidth, side - minRoomWidth)
    const splitMask = this.split2(bounds, axis, split)

    this.uniform.shuffle(splitMask)

    const leftShape = new Intersection(shape, splitMask[0])
    const rightShape = new Intersection(shape, splitMask[1])

    const otherRoom: Room = {
      entity: undefined,
      kind: 'room',
      shape: rightShape,
      rooms: [],
    }

    return {
      entity: undefined,
      kind: 'room',
      shape: leftShape,
      rooms: [otherRoom],
    }
  }

  private split2(r: Rectangle, axis: 'x' | 'y', split: number): [Rectangle, Rectangle] {
    let a: Rectangle
    let b: Rectangle
    if (axis === 'x') {
      a = Rectangle.fromBounds(r.left, r.left + split, r.top, r.bottom)
      b = Rectangle.fromBounds(a.right, r.right, r.top, r.bottom)
    } else {
      a = Rectangle.fromBounds(r.left, r.right, r.top, r.top + split)
      b = Rectangle.fromBounds(r.left, r.right, a.bottom, r.bottom)
    }
    return [a, b]
  }

  private split3(r: Rectangle, axis: 'x' | 'y', split: number, width: number): [Rectangle, Rectangle, Rectangle] {
    let a: Rectangle
    let b: Rectangle
    let c: Rectangle
    if (axis === 'x') {
      a = Rectangle.fromBounds(r.left, r.left + split, r.top, r.bottom)
      b = Rectangle.fromBounds(a.right + 1, a.right + width, r.top, r.bottom)
      c = Rectangle.fromBounds(b.right + 1, r.right, r.top, r.bottom)
    } else {
      a = Rectangle.fromBounds(r.left, r.right, r.top, r.top + split)
      b = Rectangle.fromBounds(r.left, r.right, a.bottom + 1, a.bottom + width)
      c = Rectangle.fromBounds(r.left, r.right, b.bottom + 1, r.bottom)
    }
    return [a, b, c]
  }

  private createCorridor(world: TlbWorld, region: Entity, corridor: Corridor, parent: Entity | undefined): Entity {
    const entity = world.createEntity().entity
    const connections = [
      ...corridor.exits.map(c => this.createCorridor(world, region, c, entity)),
      ...corridor.rooms.map(r => this.createRoom(world, region, r, entity)),
    ]
    if (parent !== undefined) {
      connections.push(parent)
    }
    world
      .editEntity(entity)
      .withComponent<StructureComponent>('structure', { kind: 'corridor', shape: corridor.shape, connections, region })
    corridor.entity = entity
    return entity
  }

  private createRoom(world: TlbWorld, region: Entity, room: Room, parent: Entity | undefined): Entity {
    const entity = world.createEntity().entity
    const connections = room.rooms.map(r => this.createRoom(world, region, r, entity))
    if (parent !== undefined) {
      connections.push(parent)
    }
    world.editEntity(entity).withComponent<StructureComponent>('structure', { kind: 'room', shape: room.shape, connections, region }).entity
    room.entity = entity
    return room.entity
  }

  private removeStructures(world: TlbWorld, region: Entity): void {
    const structures: Entity[] = []
    world.getStorage<StructureComponent>('structure').foreach((e, s) => {
      if (s.region === region) {
        structures.push(e)
      }
    })
    structures.forEach(e => world.deleteEntity(e))
  }

  private findEmbedding(world: TlbWorld, entity: Entity, structure: Entity): ComplexEmbedding[] | undefined {
    const s = world.getComponent<StructureComponent>(structure, 'structure')!
    if (s.region === entity) {
      const region = world.getComponent<RegionComponent>(entity, 'region')!
      const params = regionParams[region.type]
      return embedComplexes(world, this.uniform, entity, params)
    }
    return undefined
  }

  private renderCorridors(world: TlbWorld, map: WorldMap, level: number, region: Entity, corridor: Corridor): void {
    corridor.shape.foreach(p => {
      createFeatureFromType(world, map, level, p, 'corridor')
      map.levels[level].setStructure(p, corridor.entity!)
    })

    corridor.exits.forEach(c => this.renderCorridors(world, map, level, region, c))
  }

  private renderRooms(world: TlbWorld, map: WorldMap, level: number, region: Entity, corridor: Corridor): void {
    corridor.rooms.forEach(r => this.renderRoom(world, map, level, region, r))
    corridor.exits.forEach(c => this.renderRooms(world, map, level, region, c))
  }

  private renderRoom(world: TlbWorld, map: WorldMap, level: number, region: Entity, room: Room): void {
    const structureShape = room.shape.shrink()
    structureShape.foreach(p => {
      createFeatureFromType(world, map, level, p, 'room')
      map.levels[level].setStructure(p, room.entity!)
    })

    const doors = this.findPossibleDoors(map, level, room.shape.bounds())

    this.uniform.shuffle(doors)
    const count = this.exponential.integerBetween(1, doors.length)
    for (let i = 0; i < count; ++i) {
      const shape = doors[i]
      shape.foreach(p => {
        createFeatureFromType(world, map, level, p, 'corridor')
        map.levels[level].setStructure(p, room.entity!)
      })
      createAssetFromShape(world, map, level, shape, 'door')
    }

    room.rooms.forEach(r => this.renderRoom(world, map, level, region, r))
  }

  private findPossibleDoors(map: WorldMap, level: number, rectangle: Rectangle): Shape[] {
    const result: Shape[] = []
    directions.forEach(direction => {
      const center = rectangle.centerOf(direction)
      const shape = shapeOfAsset('door', center, direction)
      const shapeInsideNeighbourRoom = shape.translate(Vector.fromDirection(direction))
      const doorCanBeBuilt = shapeInsideNeighbourRoom.all(p => map.levels[level].getStructure(p) !== undefined)
      if (doorCanBeBuilt) {
        result.push(shape)
      }
    })
    return result
  }
}
