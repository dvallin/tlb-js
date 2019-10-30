import { Vector } from '../spatial'

export function* bresenham(from: Vector, to: Vector, overshoot: boolean = false, initialEps: number = 0): Iterable<Vector> {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const adx = Math.abs(dx)
  const ady = Math.abs(dy)
  const sx = dx > 0 ? 1 : -1
  const sy = dy > 0 ? 1 : -1
  var eps = initialEps
  if (adx > ady) {
    for (let x = from.x, y = from.y; overshoot || sx < 0 ? x >= to.x : x <= to.x; x += sx) {
      yield new Vector([x, y])
      eps += ady
      if (eps << 1 >= adx) {
        y += sy
        eps -= adx
      }
    }
  } else {
    for (let x = from.x, y = from.y; sy < 0 ? y >= to.y : y <= to.y; y += sy) {
      yield new Vector([x, y])
      eps += adx
      if (eps << 1 >= ady) {
        x += sx
        eps -= ady
      }
    }
  }
}
