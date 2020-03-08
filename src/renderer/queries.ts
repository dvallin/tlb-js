import { TlbWorld } from '../tlb'
import { WorldMapResource } from '../resources/world-map'
import { Vector } from '../spatial'
import { bfs } from './bfs'
import { FunctionalShape } from '../geometry/functional-shape'
import { astar, Path } from './astar'
import { Entity } from '../ecs/entity'
import { digitalLine } from './digital-line'
import { PermissiveFov } from 'permissive-fov'

export interface QueryParameters {
  onlyDiscovered: boolean
  maximumCost: number
  bestEffort: boolean
  self: Entity
}

export class Queries {
  public fov(world: TlbWorld, level: number, origin: Vector, callback: (pos: Vector) => void) {
    const originFloor = new Vector([origin.fX, origin.fY])
    const map = world.getResource<WorldMapResource>('map')
    const fov = new PermissiveFov(map.width, map.width, (x, y) => !map.levels[level].isLightBlocking(world, new Vector([x, y])))
    fov.compute(originFloor.x, originFloor.y, 20, (x, y) => {
      callback(new Vector([x, y]))
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
    const originFloor = new Vector([origin.fX, origin.fY])
    const maximumDepth = params.maximumCost || Number.MAX_SAFE_INTEGER
    const onlyDiscovered = params.onlyDiscovered || false
    bfs(
      map.levels[level].boundary.width,
      originFloor,
      target => FunctionalShape.lN(target, 1, false),
      visit,
      (target, depth) => {
        if (depth >= maximumDepth || map.levels[level].isBlocking(world, target)) {
          return false
        }
        return onlyDiscovered ? map.levels[level].isDiscovered(target) : true
      }
    )
  }

  public shortestPath(world: TlbWorld, level: number, origin: Vector, target: Vector, params: Partial<QueryParameters>): Path | undefined {
    const map = world.getResource<WorldMapResource>('map')
    const onlyDiscovered = params.onlyDiscovered || false
    const originFloor = new Vector([origin.fX, origin.fY])
    const targetFloor = new Vector([target.fX, target.fY])
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

  public los(world: TlbWorld, level: number, origin: Vector, target: Vector, params: Partial<QueryParameters>): Path | undefined {
    const map = world.getResource<WorldMapResource>('map')
    const originFloor = new Vector([origin.fX, origin.fY])
    const targetFloor = new Vector([target.fX, target.fY])
    const maximumCost = params.maximumCost || Number.MAX_SAFE_INTEGER
    if (targetFloor.minus(originFloor).length() <= maximumCost) {
      const path = digitalLine(originFloor, targetFloor, p => map.levels[level].isLightBlocking(world, p, false))
      if (path !== undefined) {
        return { path: path.slice(1, path.length), cost: path.length - 1 }
      }
    }
    return undefined
  }
}
