import { Random } from '../random';
export declare function retry<T>(random: Random, arr: T[], f: (v: T) => boolean): void;
