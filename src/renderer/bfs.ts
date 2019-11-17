import { Vector } from '../spatial'
import { Shape } from '../geometry/shape'
import { SetSpace } from '../spatial/set-space'

export function bfs(
  width: number,
  origin: Vector,
  neighbourhood: (target: Vector) => Shape,
  visit: (target: Vector, depth: number) => boolean,
  canVisit: (target: Vector, depth: number) => boolean
): void {
  const visited: SetSpace = new SetSpace(width)
  visited.set(origin)
  let currentDepth: number = 1
  let currentLayer: Vector[] = []
  let nextLayer: Vector[] = []
  putNeighboursIntoNextLayer(visited, neighbourhood(origin), currentLayer, n => canVisit(n, currentDepth))

  let finished = false
  while (!finished) {
    const current = currentLayer.pop()
    if (current !== undefined) {
      finished = visit(current, currentDepth)
      putNeighboursIntoNextLayer(visited, neighbourhood(current), nextLayer, n => canVisit(n, currentDepth))
    } else {
      currentLayer = nextLayer
      nextLayer = []
      currentDepth++
      if (currentLayer.length === 0) {
        break
      }
    }
  }
}

function putNeighboursIntoNextLayer(
  visited: SetSpace,
  neighbourhood: Shape,
  layer: Vector[],
  canVisit: (neighbour: Vector) => boolean
): void {
  neighbourhood.foreach(neighbour => {
    if (!visited.has(neighbour) && canVisit(neighbour)) {
      layer.push(neighbour)
      visited.set(neighbour)
    }
  })
}
