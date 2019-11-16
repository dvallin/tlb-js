import { Shape } from '../geometry/shape'
import { Random } from '../random'
import { Distribution } from '../random/distributions'
import { Rectangle } from '../geometry/rectangle'
import { Intersection } from '../geometry/intersection'
import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'

export interface Corridor {
  kind: 'corridor'
  shape: Shape
  exits: Corridor[]
  rooms: Room[]
  hubs: Hub[]

  entity?: Entity
}

export interface Room {
  kind: 'room'
  shape: Shape
  rooms: Room[]

  entity?: Entity
}

export interface Hub {
  kind: 'hub'
  shape: Shape
  exits: Corridor[]

  entity?: Entity
}

export class SpacePartitioner {
  private readonly uniform: Random

  public constructor(rng: Distribution) {
    this.uniform = new Random(rng)
  }

  public planStructureWithExits(
    shape: Shape,
    regionExits: Vector[],
    minRoomWidth: number,
    maxRoomWidth: number,
    corridorWidth: number
  ): Corridor | Room {
    if (regionExits.length === 0) {
      return this.planStructure(shape, minRoomWidth, maxRoomWidth, corridorWidth)
    }
    const [head, ...tail] = regionExits

    const bounds = shape.bounds()
    const axis = head.x === bounds.left || head.x === bounds.right ? 'y' : 'x'
    const halfCorridorWidth = Math.floor(corridorWidth / 2)
    const split = axis === 'x' ? head.x - bounds.topLeft.x - halfCorridorWidth : head.y - bounds.topLeft.y - halfCorridorWidth
    const splitMask = this.split3(bounds, axis, split, corridorWidth)
    const leftShape = new Intersection(shape, splitMask[0])
    const corridorShape = new Intersection(shape, splitMask[1])
    const rightShape = new Intersection(shape, splitMask[2])

    const left = this.planStructureWithExits(
      leftShape,
      tail.filter(e => leftShape.containsVector(e)),
      minRoomWidth,
      maxRoomWidth,
      corridorWidth
    )
    const right = this.planStructureWithExits(
      rightShape,
      tail.filter(e => leftShape.containsVector(e)),
      minRoomWidth,
      maxRoomWidth,
      corridorWidth
    )

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
      hubs: [],
    }
  }

  public planStructure(shape: Shape, minRoomWidth: number, maxRoomWidth: number, corridorWidth: number): Corridor | Room {
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
    const splitMask = this.split3(bounds, axis, split, corridorWidth)

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
      kind: 'corridor',
      shape: corridorShape,
      exits,
      rooms,
      hubs: [],
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
}
