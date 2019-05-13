import { Rectangle } from '../geometry/rectangle'
import { Renderer } from '../renderer/renderer'
import { Difference } from '../geometry/difference'
import { primary, gray } from '../renderer/palettes'
import { Input } from '../resources/input'
import { Vector } from '../spatial'

export class WindowDecoration {
  public hovered: boolean = false
  public collapsed: boolean = false

  private effectiveRectangle: Rectangle

  public constructor(private rectangle: Rectangle, public title: string) {
    this.effectiveRectangle = new Rectangle(rectangle.x, rectangle.y, rectangle.width, rectangle.height)
  }

  public get topLeft(): Vector {
    return this.effectiveRectangle.topLeft
  }

  public get right(): number {
    return this.effectiveRectangle.right
  }

  public get bottom(): number {
    return this.effectiveRectangle.bottom
  }

  public get content(): Rectangle {
    return this.effectiveRectangle.shrink()
  }

  public containsVector(vector: Vector): boolean {
    return this.effectiveRectangle.containsVector(vector)
  }

  public get width(): number {
    return this.effectiveRectangle.width
  }

  public setHeight(height: number): void {
    this.rectangle = new Rectangle(this.rectangle.x, this.rectangle.y, this.rectangle.width, height)
    this.effectiveRectangle = new Rectangle(this.effectiveRectangle.x, this.effectiveRectangle.y, this.effectiveRectangle.width, height)
  }

  public setY(y: number): void {
    this.rectangle = new Rectangle(this.rectangle.x, y, this.rectangle.width, this.rectangle.height)
    this.effectiveRectangle = new Rectangle(this.effectiveRectangle.x, y, this.effectiveRectangle.width, this.effectiveRectangle.height)
  }

  public collapse(): void {
    this.effectiveRectangle = new Rectangle(this.rectangle.x, this.rectangle.y, this.rectangle.width, 1)
  }
  public expand(): void {
    this.effectiveRectangle = new Rectangle(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height)
  }

  public render(renderer: Renderer) {
    Difference.innerBorder(this.effectiveRectangle).foreach(p => {
      if (p.y === this.effectiveRectangle.top || p.y === this.effectiveRectangle.bottom) {
        const bg = this.hovered && p.y === this.effectiveRectangle.top ? gray[1] : undefined
        renderer.character('-', p, primary[1], bg)
      } else {
        renderer.character('|', p, primary[1])
      }
    })
    const titleText = `/${this.title}/`
    renderer.text(
      titleText,
      { x: this.effectiveRectangle.right - titleText.length, y: this.effectiveRectangle.top },
      primary[1],
      this.hovered ? gray[1] : undefined
    )
  }

  public update(input: Input): void {
    if (input.position) {
      this.hovered =
        input.position.x >= this.effectiveRectangle.left &&
        input.position.x < this.effectiveRectangle.right &&
        input.position.y === this.effectiveRectangle.y
    }
    if (this.hovered && input.mousePressed) {
      this.collapsed = !this.collapsed
      if (this.collapsed) {
        this.collapse()
      } else {
        this.expand()
      }
    }
  }
}
