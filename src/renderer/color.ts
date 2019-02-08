import * as rot from 'rot-js'

export class Color {
  public static fromHex(hex: string): Color {
    const color = rot.Color.fromString(hex)
    return new Color([color[0], color[1], color[2]])
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
