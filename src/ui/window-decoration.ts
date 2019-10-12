import { Rectangle } from '../geometry/rectangle'
import { Renderer } from '../renderer/renderer'
import { Difference } from '../geometry/difference'
import { primary } from '../renderer/palettes'
import { Input } from '../resources/input'
import { Vector } from '../spatial'

export class WindowDecoration {
  public constructor(private rectangle: Rectangle, public title: string, public bottomCollapse: boolean = false) {}

  public get topLeft(): Vector {
    return this.rectangle.topLeft
  }

  public get right(): number {
    return this.rectangle.right
  }

  public get bottom(): number {
    return this.rectangle.bottom
  }

  public get content(): Rectangle {
    return this.rectangle.shrink()
  }

  public containsVector(vector: Vector): boolean {
    return this.rectangle.containsVector(vector)
  }

  public get width(): number {
    return this.rectangle.width
  }

  public render(renderer: Renderer) {
    Difference.innerBorder(this.rectangle).foreach(p => {
      if (p.y === this.rectangle.top || p.y === this.rectangle.bottom) {
        renderer.character('-', p, primary[1])
      } else {
        renderer.character('|', p, primary[1])
      }
    })
    const titleText = `/${this.title}/`
    renderer.text(titleText, { x: this.rectangle.right - titleText.length, y: this.rectangle.top }, primary[1])
  }

  public update(_input: Input): void {}
}
