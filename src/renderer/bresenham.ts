import { Vector } from '../spatial'

export function bresenham(from: Vector, direction: Vector, overshoot: boolean = false): () => Vector | undefined {
  let delta = { x: Math.abs(direction.x), y: Math.abs(direction.y) }
  const sign = { x: Math.sign(direction.x), y: Math.sign(direction.y) }

  let swap = false
  if (delta.y > delta.x) {
    delta = { x: delta.y, y: delta.x }
    swap = true
  }

  let d = 2.0 * delta.y - delta.x
  let index = 0
  const current = { x: from.x, y: from.y }
  let done = false

  return () => {
    if (done) {
      return undefined
    }

    const result = new Vector(current.x, current.y)
    if (overshoot || index < delta.x) {
      while (d > 0) {
        d -= 2 * delta.x
        if (swap) {
          current.x += sign.x
        } else {
          current.y += sign.y
        }
      }
      d += 2 * delta.y
      if (swap) {
        current.y += sign.y
      } else {
        current.x += sign.x
      }
    } else {
      done = true
    }

    index += 1
    return result
  }
}
