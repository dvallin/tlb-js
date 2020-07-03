interface Entry<T> {
    priority: number;
    key: string;
    value: T;
}
export declare class RadixHeap<T> {
    readonly maximumKeySpan: number;
    readonly bucketCount: number;
    readonly bucketOfValue: Map<string, number>;
    readonly buckets: Entry<T>[][];
    readonly boundaries: number[];
    constructor(maximumKeySpan: number);
    insert(key: string, value: T, priority: number): void;
    getPriority(key: string): number | undefined;
    decreasePriority(key: string, priority: number): void;
    extractMin(): T | undefined;
    private removeFromBucket;
    private insertIntoLargestPossibleBucket;
    private findInBucket;
}
export {};
