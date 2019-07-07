export type Leaf<T> = { value: T }
export type Tree<T> = { values: (Tree<T> | undefined | Leaf<T>)[] }

function isTree<T>(node: Leaf<T> | Tree<T>): node is Tree<T> {
  return (<Tree<T>>node).values !== undefined
}

export function getLeaf<T>(root: Tree<T>, indices: number[]): Leaf<T> | undefined {
  for (let d = 0; d < indices.length; d++) {
    const leaf: Leaf<T> | Tree<T> | undefined = root.values[indices[d]]
    if (leaf === undefined) {
      return undefined
    } else if (isTree(leaf)) {
      root = leaf
    } else {
      return leaf
    }
  }
  return undefined
}

export function get<T>(root: Tree<T>, indices: number[]): T | undefined {
  const leaf = getLeaf(root, indices)
  if (leaf !== undefined) {
    return leaf.value
  }
  return undefined
}

export function insert<T>(root: Tree<T>, indices: number[], value: T) {
  for (let d = 0; d < indices.length - 1; d++) {
    const pos = indices[d]
    let leaf: Leaf<T> | Tree<T> | undefined = root.values[pos]
    if (leaf === undefined) {
      leaf = { values: [] }
      root.values[pos] = leaf
    } else if (!isTree(leaf)) {
      throw Error()
    }
    root = leaf
  }
  root.values[indices[indices.length - 1]] = { value }
}

export function remove<T>(root: Tree<T>, indices: number[]): T | undefined {
  for (let d = 0; d < indices.length - 1; d++) {
    let leaf: Leaf<T> | Tree<T> | undefined = root.values[indices[d]]
    if (leaf === undefined) {
      return undefined
    } else if (isTree(leaf)) {
      root = leaf
    } else {
      throw Error()
    }
  }
  const leaf = root.values[indices[indices.length - 1]]
  if (leaf !== undefined && !isTree(leaf)) {
    const value = leaf.value
    delete root.values[indices[indices.length - 1]]
    return value
  }
  return undefined
}
