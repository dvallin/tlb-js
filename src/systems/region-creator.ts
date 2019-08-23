import { createFeature } from '../components/feature'
import { createLight } from '../components/light'
import { RegionComponent, StructureComponent } from '../components/region'
import { Entity } from '../ecs/entity'
import { Intersection } from '../geometry/intersection'
import { Rectangle } from '../geometry/rectangle'
import { Shape } from '../geometry/shape'
import { Random } from '../random'
import { Distribution, Exponential } from '../random/distributions'
import { Color } from '../renderer/color'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { Vector } from '../spatial'
import { directions } from '../spatial/direction'
import { ComponentName, TlbSystem, TlbWorld } from '../tlb'

interface Corridor {
  kind: 'corridor'
  shape: Shape
  exits: Corridor[]
  rooms: Room[]
}

interface Room {
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

    const structure = this.buildStructure(region.shape, 8, 15, 3) as Corridor

    const map = world.getResource<WorldMapResource>('map')
    this.renderCorridors(world, map, region.level, structure)
    this.renderRooms(world, map, region.level, structure)
    this.createConnections(world, map, region.level)

    region.entry = structure.shape.bounds().center

    world.editEntity(entity).removeComponent('active')
  }

  private buildStructure(shape: Shape, minRoomWidth: number, maxRoomWidth: number, corridorWidth: number): Corridor | Room {
    const bounds = shape.bounds()

    const canCorridorSplit = this.canSplit(bounds, side => this.canCorridorSplit(side, maxRoomWidth, corridorWidth))
    const canRoomSplit = this.canSplit(bounds, side => this.canRoomSplit(side, minRoomWidth))
    if (canCorridorSplit.length > 0) {
      return this.corridorSplit(shape, minRoomWidth, maxRoomWidth, corridorWidth, this.uniform.pick(canCorridorSplit))
    } else if (canRoomSplit.length > 0) {
      return this.roomSplit(shape, minRoomWidth, this.uniform.pick(canRoomSplit))
    } else {
      return {
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

    const left = this.buildStructure(leftShape, minRoomWidth, maxRoomWidth, corridorWidth)
    const right = this.buildStructure(rightShape, minRoomWidth, maxRoomWidth, corridorWidth)

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
      kind: 'room',
      shape: rightShape,
      rooms: [],
    }

    return {
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

  private renderCorridors(world: TlbWorld, map: WorldMap, level: number, corridor: Corridor): void {
    const entity = world.createEntity().withComponent<StructureComponent>('structure', {
      kind: 'corridor',
      shape: corridor.shape,
      connections: [],
    }).entity

    corridor.shape.foreach(p => {
      createFeature(world, map, level, p, 'corridor')
      map.levels[level].setRoom(p, entity)
    })

    const color = new Color([
      this.uniform.integerBetween(100, 255),
      this.uniform.integerBetween(100, 255),
      this.uniform.integerBetween(100, 255),
    ])
    createLight(world, map, level, corridor.shape.bounds().center, color)

    corridor.exits.forEach(c => this.renderCorridors(world, map, level, c))
  }

  private renderRooms(world: TlbWorld, map: WorldMap, level: number, corridor: Corridor): void {
    corridor.rooms.forEach(r => this.renderRoom(world, map, level, r))
    corridor.exits.forEach(c => this.renderRooms(world, map, level, c))
  }

  private renderRoom(world: TlbWorld, map: WorldMap, level: number, room: Room): void {
    const entity = world.createEntity().withComponent<StructureComponent>('structure', {
      kind: 'room',
      shape: room.shape,
      connections: [],
    }).entity
    room.shape.shrink().foreach(p => {
      createFeature(world, map, level, p, 'room')
      map.levels[level].setRoom(p, entity)
    })

    const color = new Color([
      this.uniform.integerBetween(100, 255),
      this.uniform.integerBetween(100, 255),
      this.uniform.integerBetween(100, 255),
    ])
    createLight(world, map, level, room.shape.bounds().center, color)

    const doors = this.findPossibleDoors(world, map, level, room.shape.bounds())

    this.uniform.shuffle(doors)
    const count = this.exponential.integerBetween(1, doors.length)
    for (let i = 0; i < count; ++i) {
      doors[i].foreach(p => {
        createFeature(world, map, level, p, 'corridor')
        map.levels[level].setRoom(p, entity)
      })
    }

    room.rooms.forEach(r => this.renderRoom(world, map, level, r))
  }

  private findPossibleDoors(world: TlbWorld, map: WorldMap, level: number, rectangle: Rectangle): Shape[] {
    const result: Shape[] = []
    directions.forEach(direction => {
      const center = rectangle.centerOf(direction)
      const footprint = Rectangle.footprint(center, direction, 3)
      const entryFootprint = footprint.translate(Vector.fromDirection(direction))
      const doorCanBeBuilt = entryFootprint.all(p => map.levels[level].tileMatches(world, p, t => t !== undefined && t.type !== 'wall'))
      if (doorCanBeBuilt) {
        result.push(footprint)
      }
    })
    return result
  }

  private createConnections(world: TlbWorld, map: WorldMap, level: number) {
    map.levels[level].boundary.foreach(p => {
      const focus = map.levels[level].getRoom(p)
      if (focus !== undefined) {
        const structure = world.getComponent<StructureComponent>(focus, 'structure')!
        directions.forEach(d => {
          const position = p.add(Vector.fromDirection(d))
          const other = map.levels[level].getRoom(position)
          if (other !== undefined && other !== focus) {
            structure.connections.push({
              position,
              other,
            })
          }
        })
      }
    })
  }
}
