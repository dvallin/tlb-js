import * as rot from 'rot-js'

export class Color {
  public static fromHex(hex: string): Color {
    return new Color(rot.Color.fromString(hex) as [number, number, number])
  }

  public constructor(public color: [number, number, number]) {}

  private rgb: string | undefined = undefined
  public toRgb(): string {
    if (this.rgb === undefined) {
      this.rgb = rot.Color.toRGB(this.color)
    }
    return this.rgb
  }

  public brightness(): number {
    return (this.color[0] + this.color[1] + this.color[2]) / 3
  }

  public add(other: Color): Color {
    return new Color(rot.Color.add(this.color, other.color))
  }

  public multiply(other: Color): Color {
    return new Color(rot.Color.multiply(this.color, other.color))
  }
}
