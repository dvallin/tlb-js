import { FOV, Lighting } from 'rot-js'
import { TlbWorld } from '../tlb'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { Vector } from '../spatial'
import { Color } from './color'
import { bfs } from './bfs'
import { FunctionalShape } from '../geometry/functional-shape'
import { astar, Path } from './astar'
import { LineSegment } from '../geometry/line-segment'

export interface QueryParameters {
  onlyDiscovered: boolean
  maximumCost: number
  bestEffort: boolean
}

export class Queries {
  public fov(world: TlbWorld, origin: Vector, callback: (pos: Vector, distance: number) => void) {
    const originFloor = origin.floor()
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const fov = new FOV.RecursiveShadowcasting((x, y) => !map.isLightBlocking(world, new Vector(x, y)), { topology: 8 })
    const seenAlready = new Set<string>()
    fov.compute(originFloor.x, originFloor.y, 20, (x, y, distance) => {
      const position = new Vector(x, y)
      const key = position.key
      if (!seenAlready.has(key)) {
        seenAlready.add(key)
        callback(position, distance)
      }
    })
  }

  public lighting(world: TlbWorld, origin: Vector, color: Color, callback: (pos: Vector, color: Color) => void) {
    const originFloor = origin.floor()
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const fov = new FOV.RecursiveShadowcasting((x, y) => !map.isLightBlocking(world, new Vector(x, y)), { topology: 8 })
    const lighting = new Lighting((x, y) => (map.isLightBlocking(world, new Vector(x, y)) ? 0.0 : 1.0), { passes: 1 })
    lighting.setLight(originFloor.x, originFloor.y, color.color)
    lighting.setFOV(fov)
    lighting.setOptions({ range: 6 })
    lighting.compute((x: number, y: number, c: [number, number, number]) => {
      callback(new Vector(x, y), new Color(c))
    })
  }

  public explore(
    world: TlbWorld,
    origin: Vector,
    visit: (pos: Vector, distance: number) => boolean,
    params: Partial<QueryParameters>
  ): void {
    const originFloor = origin.floor()
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const maximumDepth = params.maximumCost || Number.MAX_SAFE_INTEGER
    const onlyDiscovered = params.onlyDiscovered || false
    bfs(originFloor, target => FunctionalShape.lN(target, 1, false), visit, (target, depth) => {
      if (depth >= maximumDepth || map.isBlocking(world, target)) {
        return false
      }
      return onlyDiscovered ? map.isDiscovered(target) : true
    })
  }

  public shortestPath(world: TlbWorld, origin: Vector, target: Vector, params: Partial<QueryParameters>): Path | undefined {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const onlyDiscovered = params.onlyDiscovered || false
    const originFloor = origin.floor()
    const targetFloor = target.floor()
    const maximumCost = params.maximumCost || Number.MAX_SAFE_INTEGER
    const bestEffort = params.bestEffort || false
    const path = astar(
      originFloor,
      targetFloor,
      (current, neighbour) => {
        if (map.isBlocking(world, neighbour)) {
          return undefined
        }
        if (onlyDiscovered && !map.isDiscovered(neighbour)) {
          return undefined
        }
        return current.minus(neighbour).l1()
      },
      v => FunctionalShape.lN(v, 1, false),
      v => targetFloor.minus(v).lN(),
      maximumCost,
      bestEffort
    )
    if (path !== undefined && path.path.length - 1 <= maximumCost) {
      return { path: path.path.slice(0, path.path.length - 1), cost: path.cost }
    }
    return undefined
  }

  public ray(world: TlbWorld, origin: Vector, target: Vector, params: Partial<QueryParameters>): Path | undefined {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const originFloor = origin.floor()
    const targetFloor = target.floor()
    const maximumCost = params.maximumCost || Number.MAX_SAFE_INTEGER
    const path: Vector[] = []
    const success = new LineSegment(targetFloor, originFloor).all(p => {
      path.push(p)
      return !map.isLightBlocking(world, p, false)
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
