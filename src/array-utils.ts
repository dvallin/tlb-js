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
