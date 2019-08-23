import { FOV, Lighting } from 'rot-js'
import { TlbWorld } from '../tlb'
import { WorldMapResource } from '../resources/world-map'
import { Vector } from '../spatial'
import { Color } from './color'
import { bfs } from './bfs'
import { FunctionalShape } from '../geometry/functional-shape'
import { astar, Path } from './astar'
import { LineSegment } from '../geometry/line-segment'
import { Entity } from '../ecs/entity'
import { DiscreteSetSpace } from '../spatial/set-space'

export interface QueryParameters {
  onlyDiscovered: boolean
  maximumCost: number
  bestEffort: boolean
  self: Entity
}

export class Queries {
  public fov(world: TlbWorld, level: number, origin: Vector, callback: (pos: Vector, distance: number) => void) {
    const originFloor = origin.floor()
    const map = world.getResource<WorldMapResource>('map')
    const fov = new FOV.RecursiveShadowcasting((x, y) => !map.levels[level].isLightBlocking(world, new Vector([x, y])), { topology: 8 })
    const seenAlready = new DiscreteSetSpace(map.levels[level].boundary.width)
    fov.compute(originFloor.x, originFloor.y, 20, (x, y, distance) => {
      const position = new Vector([x, y])
      if (!seenAlready.has(position)) {
        seenAlready.set(position)
        callback(position, distance)
      }
    })
  }

  public lighting(world: TlbWorld, level: number, origin: Vector, color: Color, callback: (pos: Vector, color: Color) => void) {
    const map = world.getResource<WorldMapResource>('map')
    const originFloor = origin.floor()
    const fov = new FOV.RecursiveShadowcasting((x, y) => !map.levels[level].isLightBlocking(world, new Vector([x, y])), { topology: 8 })
    const lighting = new Lighting((x, y) => (map.levels[level].isLightBlocking(world, new Vector([x, y])) ? 0.0 : 1.0), { passes: 1 })
    lighting.setLight(originFloor.x, originFloor.y, color.color)
    lighting.setFOV(fov)
    lighting.setOptions({ range: 6 })
    lighting.compute((x: number, y: number, c: [number, number, number]) => {
      callback(new Vector([x, y]), new Color(c))
    })
  }

  public explore(
    world: TlbWorld,
    level: number,
    origin: Vector,
    visit: (pos: Vector, distance: number) => boolean,
    params: Partial<QueryParameters>
  ): void {
    const map = world.getResource<WorldMapResource>('map')
    const originFloor = origin.floor()
    const maximumDepth = params.maximumCost || Number.MAX_SAFE_INTEGER
    const onlyDiscovered = params.onlyDiscovered || false
    bfs(map.levels[level].boundary.width, originFloor, target => FunctionalShape.lN(target, 1, false), visit, (target, depth) => {
      if (depth >= maximumDepth || map.levels[level].isBlocking(world, target)) {
        return false
      }
      return onlyDiscovered ? map.levels[level].isDiscovered(target) : true
    })
  }

  public shortestPath(world: TlbWorld, level: number, origin: Vector, target: Vector, params: Partial<QueryParameters>): Path | undefined {
    const map = world.getResource<WorldMapResource>('map')
    const onlyDiscovered = params.onlyDiscovered || false
    const originFloor = origin.floor()
    const targetFloor = target.floor()
    const maximumCost = params.maximumCost || Number.MAX_SAFE_INTEGER
    const bestEffort = params.bestEffort || false
    const path = astar(
      originFloor,
      targetFloor,
      (current, neighbour) => {
        if (map.levels[level].isBlocking(world, neighbour)) {
          return undefined
        }
        if (onlyDiscovered && !map.levels[level].isDiscovered(neighbour)) {
          return undefined
        }
        return current.minus(neighbour).l1()
      },
      v => FunctionalShape.l1(v, 1, false),
      v => targetFloor.minus(v).l1(),
      maximumCost,
      bestEffort
    )
    if (path !== undefined && path.path.length - 1 <= maximumCost) {
      return { path: path.path.slice(0, path.path.length - 1), cost: path.cost }
    }
    return undefined
  }

  public ray(world: TlbWorld, level: number, origin: Vector, target: Vector, params: Partial<QueryParameters>): Path | undefined {
    const map = world.getResource<WorldMapResource>('map')
    const originFloor = origin.floor()
    const targetFloor = target.floor()
    const maximumCost = params.maximumCost || Number.MAX_SAFE_INTEGER
    const path: Vector[] = []
    const success = new LineSegment(targetFloor, originFloor).all(p => {
      path.push(p)
      return !map.levels[level].isLightBlocking(world, p, false)
    })
    if (success) {
      let cost = path.length - 1
      if (path.length - 1 <= maximumCost) {
        return { path: path.slice(0, path.length - 1), cost: cost }
      }
    }
    return undefined
  }
}
