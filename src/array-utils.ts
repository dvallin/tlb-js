export function findAll<T>(arr: T[], predicate: (v: T) => boolean): number[] {
  const result: number[] = []
  arr.forEach((v, i) => {
    if (predicate(v)) {
      result.push(i)
    }
  })
  return result
}

export function indices(to: number): number[] {
  const indices: number[] = []
  for (let i = 0; i < to; i++) {
    indices.push(i)
  }
  return indices
}

export function dropAt<T>(arr: T[], index: number): void {
  arr[index] = arr[arr.length - 1]
  arr.pop()
}
