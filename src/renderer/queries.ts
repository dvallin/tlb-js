import { FOV, Lighting } from 'rot-js'
import { TlbWorld } from '../tlb'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { Vector } from '../spatial'
import { Color } from './color'
import { bfs } from '../ecs/bfs'
import { FunctionalShape } from '../geometry/functional-shape'
import { Path } from 'rot-js'

export interface QueryParameters {
  onlyDiscovered: boolean
  maximumDepth: number
}

export class Queries {
  public fov(world: TlbWorld, origin: Vector, callback: (pos: Vector, distance: number) => void) {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const fov = new FOV.RecursiveShadowcasting((x, y) => !map.isLightBlocking(world, new Vector(x, y)), { topology: 8 })
    const seenAlready = new Set<string>()
    fov.compute(origin.x, origin.y, 20, (x, y, distance) => {
      const position = new Vector(x, y)
      const key = position.key
      if (!seenAlready.has(key)) {
        seenAlready.add(key)
        callback(position, distance)
      }
    })
  }

  public lighting(world: TlbWorld, origin: Vector, color: Color, callback: (pos: Vector, color: Color) => void) {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const fov = new FOV.RecursiveShadowcasting((x, y) => !map.isLightBlocking(world, new Vector(x, y)), { topology: 8 })
    const lighting = new Lighting((x, y) => (map.isLightBlocking(world, new Vector(x, y)) ? 0.0 : 1.0), { passes: 1 })
    lighting.setLight(origin.x, origin.y, color.color)
    lighting.setFOV(fov)
    lighting.setOptions({ range: 6 })
    lighting.compute((x: number, y: number, c: [number, number, number]) => {
      callback(new Vector(x, y), new Color(c))
    })
  }

  public explore(world: TlbWorld, origin: Vector, visit: (pos: Vector, distance: number) => void, params: Partial<QueryParameters>): void {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const maximumDepth = params.maximumDepth || Number.MAX_SAFE_INTEGER
    const onlyDiscovered = params.onlyDiscovered || false
    bfs(origin.floor(), target => FunctionalShape.LN(target, 1, false), visit, (target, depth) => {
      if (depth >= maximumDepth || map.isBlocking(world, target)) {
        return false
      }
      return onlyDiscovered ? map.isDiscovered(target) : true
    })
  }

  public shortestPath(world: TlbWorld, origin: Vector, target: Vector, params: Partial<QueryParameters>): Vector[] | undefined {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const maximumDepth = params.maximumDepth || Number.MAX_SAFE_INTEGER
    const onlyDiscovered = params.onlyDiscovered || false
    const originFloor = origin.floor()
    const targetFloor = target.floor()
    const algorithm = new Path.AStar(
      originFloor.x,
      originFloor.y,
      (x, y) => {
        const position = new Vector(x, y)
        if (position.equals(originFloor)) {
          return true
        }
        if (map.isBlocking(world, position)) {
          return false
        }
        return onlyDiscovered ? map.isDiscovered(position) : true
      },
      { topology: 8 }
    )
    const path: Vector[] = []
    algorithm.compute(targetFloor.x, targetFloor.y, (x, y) => path.push(new Vector(x, y)))
    if (path.length - 2 <= maximumDepth) {
      return path
    }
    return undefined
  }
}
