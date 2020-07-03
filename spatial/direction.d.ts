export declare type Direction = 'up' | 'right' | 'down' | 'left';
export declare const directions: Direction[];
export declare function leftOf(direction: Direction): Direction;
export declare function rightOf(direction: Direction): Direction;
export declare function oppositeOf(direction: Direction): Direction;
