export function skip<T>(iter: Iterable<T>, n: number): Iterable<T> {
  let times = n
  for (const _ of iter) {
    if (times-- < 0) {
      break
    }
  }
  return iter
}

export function head<T>(iter: Iterable<T>): T | undefined {
  for (const i of iter) {
    return i
  }
  return undefined
}

export function take<T>(iter: Iterable<T>, n: number): T[] {
  const result: T[] = []
  let times = n
  for (const i of iter) {
    result.push(i)
    if (times-- < 0) {
      break
    }
  }
  return result
}
