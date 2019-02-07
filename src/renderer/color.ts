import * as rot from 'rot-js'

export class Color {
  public static fromHex(hex: string): Color {
    return new Color(rot.Color.fromString(hex))
  }

  public readonly rgb: string

  public constructor(public color: [number, number, number]) {
    this.rgb = rot.Color.toRGB(color)
  }

  public add(other: Color): Color {
    return new Color(rot.Color.add(this.color, other.color))
  }

  public multiply(other: Color): Color {
    return new Color(rot.Color.multiply(this.color, other.color))
  }
}
