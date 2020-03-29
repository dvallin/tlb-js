import { dropAt } from '../array-utils'

interface Entry<T> {
  priority: number
  key: string
  value: T
}

export class RadixHeap<T> {
  public readonly bucketCount: number
  public readonly bucketOfValue: Map<string, number> = new Map()
  public readonly buckets: Entry<T>[][] = []
  public readonly boundaries: number[] = []

  constructor(public readonly maximumKeySpan: number) {
    this.bucketCount = Math.floor(Math.log2(maximumKeySpan + 1)) + 1
    this.boundaries[0] = 0
    this.buckets[0] = []
    this.boundaries[1] = 1
    this.buckets[1] = []
    this.boundaries[this.bucketCount + 1] = maximumKeySpan
    for (let i = 2; i <= this.bucketCount; i++) {
      this.boundaries[i] = 2 << (i - 2)
      this.buckets[i] = []
    }
  }

  insert(key: string, value: T, priority: number): void {
    this.insertIntoLargestPossibleBucket(key, value, priority, this.bucketCount)
  }

  getPriority(key: string): number | undefined {
    let bucket = this.bucketOfValue.get(key)
    if (bucket === undefined) {
      return undefined
    }
    return this.findInBucket(bucket, key)
  }

  decreasePriority(key: string, priority: number): void {
    let bucket = this.bucketOfValue.get(key)
    if (bucket === undefined) {
      throw Error(`unknown bucket for key ${key}`)
    }
    const entry = this.removeFromBucket(key, bucket)
    this.insertIntoLargestPossibleBucket(key, entry.value, priority, bucket)
  }

  extractMin(): T | undefined {
    let result = this.buckets[0].pop()
    if (result === undefined) {
      let bucket = 1
      while (bucket <= this.bucketCount && this.buckets[bucket].length === 0) {
        bucket++
      }
      if (bucket > this.bucketCount) {
        return undefined
      }
      let smallestK = Number.MAX_SAFE_INTEGER
      const currentBucket = this.buckets[bucket]
      this.buckets[bucket] = []
      for (let i = 0; i < currentBucket.length; i++) {
        const entry = currentBucket[i]
        if (smallestK > entry.priority) {
          smallestK = entry.priority
        }
        this.bucketOfValue.delete(entry.key)
      }

      this.boundaries[0] = smallestK
      this.boundaries[1] = smallestK + 1
      for (let i = 2; i <= bucket; i++) {
        this.boundaries[i] = Math.min(this.boundaries[i - 1] + (2 << (i - 2)), this.boundaries[bucket + 1])
      }
      for (let i = 0; i < currentBucket.length; i++) {
        const entry = currentBucket[i]
        this.insertIntoLargestPossibleBucket(entry.key, entry.value, entry.priority, bucket)
      }
      result = this.buckets[0].pop()
    }
    this.bucketOfValue.delete(result!.key)
    return result!.value
  }

  private removeFromBucket(key: string, bucket: number): Entry<T> {
    this.bucketOfValue.delete(key)
    const currentBucket = this.buckets[bucket]
    const index = currentBucket.findIndex(v => v.key === key)!
    const entry = currentBucket[index]
    dropAt(currentBucket, index)
    return entry
  }

  private insertIntoLargestPossibleBucket(key: string, value: T, priority: number, bucket: number): void {
    while (this.boundaries[bucket] > priority) {
      --bucket
    }
    this.buckets[bucket].push({ key, value, priority })
    this.bucketOfValue.set(key, bucket)
  }

  private findInBucket(bucket: number, key: string): number | undefined {
    const currentBucket = this.buckets[bucket]
    const index = currentBucket.findIndex(v => v.key === key)!
    const entry = currentBucket[index]
    if (entry !== undefined) {
      return entry.priority
    }
    return undefined
  }
}
