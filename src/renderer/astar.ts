import { RadixHeap } from './radix-heap'
import { Vector } from '../spatial'
import { Shape } from '../geometry/shape'

export interface Path {
  path: Vector[]
  cost: number
}

export function astar(
  from: Vector,
  to: Vector,
  cost: (v: Vector, w: Vector) => number | undefined,
  neighbourhood: (target: Vector) => Shape,
  heuristic: (v: Vector) => number,
  maximumCost: number,
  bestEffort: boolean = false
): Path | undefined {
  const actualMaximumCost = bestEffort ? Number.MAX_VALUE : maximumCost
  const calculation = calculateAstar(from, to, cost, neighbourhood, heuristic, actualMaximumCost)
  return extractPath(to, calculation.parent, calculation.costMap, maximumCost)
}

function calculateAstar(
  from: Vector,
  to: Vector,
  cost: (v: Vector, w: Vector) => number | undefined,
  neighbourhood: (target: Vector) => Shape,
  heuristic: (v: Vector) => number,
  maximumCost: number
): { parent: Map<string, Vector>; costMap: Map<string, number> } {
  const targetKey = to.key
  const parent: Map<string, Vector> = new Map()
  const closed: Set<string> = new Set()
  const open: RadixHeap<Vector> = new RadixHeap(256)
  const costMap: Map<string, number> = new Map()
  open.insert(from, heuristic(from))
  costMap.set(from.key, 0)
  parent.set(from.key, from)
  while (true) {
    const position = open.extractMin()
    if (position === undefined) {
      break
    }
    const currentKey = position.key
    const currentCost = costMap.get(currentKey)!
    if (targetKey === currentKey) {
      break
    }

    closed.add(position.key)
    neighbourhood(position).foreach(neighbor => {
      const key = neighbor.key
      if (!closed.has(key)) {
        const distance = cost(position, neighbor)
        if (distance !== undefined) {
          const tentative = currentCost + distance
          const previousCost = costMap.get(key) || Number.MAX_SAFE_INTEGER
          if (tentative < previousCost && tentative <= maximumCost) {
            parent.set(key, position)
            costMap.set(key, tentative)

            const heuristicScore = tentative + heuristic(position)
            if (open.getKey(neighbor) === undefined) {
              open.insert(neighbor, heuristicScore)
            } else {
              open.decreaseKey(neighbor, heuristicScore)
            }
          }
        }
      }
    })
  }
  return { parent, costMap }
}

function extractPath(to: Vector, parent: Map<string, Vector>, costMap: Map<string, number>, maximumCost: number): Path | undefined {
  let path: Vector[] = []
  let current = to
  let cost = costMap.get(to.key)!
  while (true) {
    const key = current.key
    const tentativeCost = costMap.get(current.key)!
    if (cost > maximumCost) {
      cost = tentativeCost
    }
    if (cost <= maximumCost) {
      path.push(current)
    }

    const parentValue = parent.get(key)
    if (parentValue === undefined) {
      return undefined
    }
    if (current.key === parentValue.key) {
      break
    }
    current = parentValue
  }
  return { path, cost }
}
