export function indices(to: number): number[] {
  const indices: number[] = []
  for (let i = 0; i < to; i++) {
    indices.push(i)
  }
  return indices
}

export function dropAt<T>(arr: T[], index: number): void {
  arr[index] = tail(arr)!
  arr.pop()
}

export function tail<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}
