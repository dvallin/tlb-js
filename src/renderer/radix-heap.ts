export class RadixHeap<T> {
  public readonly bucketCount: number
  public readonly bucketOfValue: Map<T, number> = new Map()
  public readonly buckets: { key: number; value: T }[][] = []
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

  insert(value: T, key: number): void {
    this.insertIntoLargestPossibleBucket(key, value, this.bucketCount)
  }

  getKey(value: T, equals: (a: T, b: T) => boolean = (a, b) => a === b): number | undefined {
    let bucket = this.bucketOfValue.get(value)
    if (bucket === undefined) {
      return undefined
    }
    return this.findInBucket(bucket, value, equals)
  }

  decreaseKey(value: T, key: number, equals: (a: T, b: T) => boolean = (a, b) => a === b): void {
    let bucket = this.bucketOfValue.get(value)
    if (bucket === undefined) {
      throw Error(`unknown bucket for value ${value}`)
    }
    this.removeFromBucket(value, bucket, equals)
    this.insertIntoLargestPossibleBucket(key, value, bucket)
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
      let smallestK = Number.MAX_VALUE
      const currentBucket = this.buckets[bucket]
      this.buckets[bucket] = []
      for (let i = 0; i < currentBucket.length; i++) {
        const entry = currentBucket[i]
        if (smallestK > entry.key) {
          smallestK = entry.key
        }
        this.bucketOfValue.delete(entry.value)
      }

      this.boundaries[0] = smallestK
      this.boundaries[1] = smallestK + 1
      for (let i = 2; i <= bucket; i++) {
        this.boundaries[i] = Math.min(this.boundaries[i - 1] + (2 << (i - 2)), this.boundaries[bucket + 1])
      }
      for (let i = 0; i < currentBucket.length; i++) {
        const entry = currentBucket[i]
        this.insertIntoLargestPossibleBucket(entry.key, entry.value, bucket)
      }
      result = this.buckets[0].pop()
    }
    this.bucketOfValue.delete(result!.value)
    return result!.value
  }

  private removeFromBucket(value: T, bucket: number, equals: (a: T, b: T) => boolean): void {
    this.bucketOfValue.delete(value)
    const currentBucket = this.buckets[bucket]
    const index = currentBucket.findIndex(v => equals(v.value, value))!
    currentBucket[index] = currentBucket[currentBucket.length - 1]
    currentBucket.pop()!
  }

  private insertIntoLargestPossibleBucket(key: number, value: T, bucket: number): void {
    while (this.boundaries[bucket] > key) {
      --bucket
    }
    this.buckets[bucket].push({ key, value })
    this.bucketOfValue.set(value, bucket)
  }

  private findInBucket(bucket: number, value: T, equals: (a: T, b: T) => boolean): number | undefined {
    const currentBucket = this.buckets[bucket]
    const index = currentBucket.findIndex(v => equals(v.value, value))!
    const entry = currentBucket[index]
    if (entry !== undefined) {
      return entry.key
    }
    return undefined
  }
}
