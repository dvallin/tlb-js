import { RadixHeap } from '../../src/renderer/radix-heap'

function invariant2(heap: RadixHeap<string>) {
  const interval0 = heap.boundaries[1] - heap.boundaries[0]
  expect(interval0).toBeGreaterThanOrEqual(0)
  expect(interval0).toBeLessThanOrEqual(1)
  for (let i = 1; i < heap.bucketCount; i++) {
    const interval = heap.boundaries[i + 1] - heap.boundaries[i]
    expect(interval).toBeGreaterThanOrEqual(0)
    expect(interval).toBeLessThanOrEqual(1 << (i - 1))
  }
}

describe('RadixHeap', () => {
  describe('initialization', () => {
    const cases = [
      { span: 1, count: 2 },
      { span: 5, count: 3 },
    ]
    cases.forEach(({ span, count }) => {
      const heap = new RadixHeap<string>(span)

      it('has correct amount of bucket', () => {
        expect(heap.bucketCount).toEqual(count)
      })

      it('ensures invariant 2', () => {
        invariant2(heap)
      })
    })
  })

  describe('insert', () => {
    let heap: RadixHeap<string>
    beforeEach(() => {
      heap = new RadixHeap<string>(8)
    })

    it('inserts values', () => {
      heap.insert('a', 'a', 4)
      heap.insert('b', 'b', 8)
      heap.insert('c', 'b', 256)
      heap.insert('d', 'c', 2)
      heap.insert('e', 'c', 2)
      heap.insert('f', 'd', 1)
      expect(heap.buckets[0]).toHaveLength(0)
      expect(heap.buckets[1]).toHaveLength(1)
      expect(heap.buckets[2]).toHaveLength(2)
      expect(heap.buckets[3]).toHaveLength(1)
      expect(heap.buckets[4]).toHaveLength(2)
    })

    it('inserts floating points', () => {
      heap.insert('a', 'a', 3.4)
      heap.insert('b', 'd', 1.8)
      expect(heap.buckets[0]).toHaveLength(0)
      expect(heap.buckets[1]).toHaveLength(1)
      expect(heap.buckets[2]).toHaveLength(1)
    })
  })

  describe('getPriority', () => {
    let heap: RadixHeap<string>
    beforeEach(() => {
      heap = new RadixHeap<string>(8)
    })

    it('gets priorities of values', () => {
      heap.insert('a', 'a', 4)
      heap.insert('b', 'b', 8)
      heap.insert('d', 'c', 2)
      heap.insert('c', 'b', 256)
      heap.insert('e', 'c', 2)
      heap.insert('f', 'd', 1)
      expect(heap.getPriority('a')).toEqual(4)
      expect(heap.getPriority('b')).toEqual(8)
      expect(heap.getPriority('c')).toEqual(256)
      expect(heap.getPriority('d')).toEqual(2)
      expect(heap.getPriority('e')).toEqual(2)
      expect(heap.getPriority('f')).toEqual(1)
    })

    it('gets priorities of floating points', () => {
      heap.insert('a', 'a', 3.4)
      heap.insert('b', 'd', 1.8)
      expect(heap.getPriority('a')).toEqual(3.4)
      expect(heap.getPriority('b')).toEqual(1.8)
    })
  })

  describe('decreasePriority', () => {
    let heap: RadixHeap<string>
    beforeEach(() => {
      heap = new RadixHeap<string>(8)
    })

    it('puts values into previous buckets', () => {
      heap.insert('a', 'a', 4)
      heap.decreasePriority('a', 2)
      expect(heap.buckets[2]).toHaveLength(1)
    })

    it('puts values into same bucket', () => {
      heap.insert('a', 'a', 5)
      heap.decreasePriority('a', 4)
      expect(heap.buckets[3]).toHaveLength(1)
    })

    it('decreases floating points', () => {
      heap.insert('a', 'a', 3.4)
      heap.decreasePriority('a', 1.8)
      expect(heap.getPriority('a')).toEqual(1.8)
    })
  })

  describe('extractMin', () => {
    let heap: RadixHeap<string>
    beforeEach(() => {
      heap = new RadixHeap<string>(8)
    })

    it('extracts from first bucket', () => {
      heap.insert('a', 'a', 0)
      const value = heap.extractMin()
      expect(value).toEqual('a')
      expect(heap.getPriority('a')).toBeUndefined()
    })

    it('extracts from bucket', () => {
      heap.insert('a', 'a', 5)
      const value = heap.extractMin()
      expect(value).toEqual('a')
      expect(heap.getPriority('a')).toBeUndefined()
    })

    it('redistributes from bucket', () => {
      heap.insert('a', 'a', 5)
      heap.insert('b', 'b', 5)
      heap.insert('c', 'c', 7)

      expect(heap.buckets[0]).toHaveLength(0)
      expect(heap.buckets[1]).toHaveLength(0)
      expect(heap.buckets[2]).toHaveLength(0)
      expect(heap.buckets[3]).toHaveLength(3)

      heap.extractMin()

      expect(heap.buckets[0]).toHaveLength(1)
      expect(heap.buckets[1]).toHaveLength(1)
      expect(heap.buckets[2]).toHaveLength(0)
      expect(heap.buckets[3]).toHaveLength(0)

      expect(heap.getPriority('a')).toEqual(5)
      expect(heap.getPriority('c')).toEqual(7)
    })

    it('redistributes floating points', () => {
      heap.insert('a', 'a', 5.1)
      heap.insert('b', 'b', 5.1)
      heap.insert('c', 'c', 7.1)

      expect(heap.buckets[0]).toHaveLength(0)
      expect(heap.buckets[1]).toHaveLength(0)
      expect(heap.buckets[2]).toHaveLength(0)
      expect(heap.buckets[3]).toHaveLength(3)

      heap.extractMin()

      expect(heap.buckets[0]).toHaveLength(1)
      expect(heap.buckets[1]).toHaveLength(1)
      expect(heap.buckets[2]).toHaveLength(0)
      expect(heap.buckets[3]).toHaveLength(0)
    })
  })
})
