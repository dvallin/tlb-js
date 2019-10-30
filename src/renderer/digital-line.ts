import { Vector } from '../spatial'
import { bresenham } from './bresenham'

export function digitalLine(from: Vector, to: Vector, isBlocked: (p: Vector) => boolean): Vector[] | undefined {
  const maxEps = Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y))
  const minEps = -Math.floor(maxEps / 2)
  for (let eps = -Math.floor(maxEps / 2); eps < minEps + maxEps; eps++) {
    let free = true
    const path: Vector[] = []
    for (const p of bresenham(from, to, false, eps)) {
      path.push(p)
      if (isBlocked(p)) {
        free = false
        eps += Math.max(0, maxEps - path.length)
        break
      }
    }
    if (free) {
      return path
    }
  }
  return undefined
}
