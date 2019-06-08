export type Leaf<T> = { value: T; kind: 'leaf' }
export type Root<T> = { [c: number]: Root<T> | undefined | Leaf<T>; kind: 'root' }

export function getLeaf<T>(root: Root<T>, indices: number[]): Leaf<T> | undefined {
  for (let d = 0; d < indices.length; d++) {
    const leaf: Leaf<T> | Root<T> | undefined = root[indices[d]]
    if (leaf === undefined) {
      return undefined
    } else if (leaf.kind === 'root') {
      root = leaf
    } else {
      return leaf
    }
  }
  return undefined
}

export function get<T>(root: Root<T>, indices: number[]): T | undefined {
  const leaf = getLeaf(root, indices)
  if (leaf !== undefined) {
    return leaf.value
  }
  return undefined
}

export function insert<T>(root: Root<T>, indices: number[], value: T) {
  for (let d = 0; d < indices.length - 1; d++) {
    const pos = indices[d]
    let leaf: Leaf<T> | Root<T> | undefined = root[pos]
    if (leaf === undefined) {
      leaf = { kind: 'root' }
      root[pos] = leaf
    } else if (leaf.kind === 'leaf') {
      throw Error()
    }
    root = leaf
  }
  root[indices[indices.length - 1]] = { value, kind: 'leaf' }
}
