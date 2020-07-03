export declare class Color {
    color: [number, number, number];
    static fromHex(hex: string): Color;
    constructor(color: [number, number, number]);
    private rgb;
    toRgb(): string;
    brightness(): number;
    add(other: Color): Color;
    multiply(other: Color): Color;
}
