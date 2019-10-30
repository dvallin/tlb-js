import { Rectangle } from '../geometry/rectangle'
import { Input, InputResource, NumericKeyboardCommand } from '../resources/input'
import { TlbWorld } from '../tlb'
import { Vector } from '../spatial'
import { primary, gray } from '../renderer/palettes'
import { Renderer } from '../renderer/renderer'

export class Button {
  public clicked: boolean = false
  public hovered: boolean = false

  public text: string
  public bounds: Rectangle

  public constructor(private command: NumericKeyboardCommand, private position: Vector) {
    this.text = ''
    this.bounds = new Rectangle(this.position.x, this.position.y, 0, 1)
  }

  public setText(text: string) {
    this.text = text
    this.bounds = new Rectangle(this.position.x, this.position.y, text.length, 1)
  }

  public update(world: TlbWorld) {
    const input: Input = world.getResource<InputResource>('input')
    if (input.position) {
      const position = new Vector([input.position.x, input.position.y])
      this.hovered = this.bounds.containsVector(position)
      if (this.hovered && input.mousePressed) {
        this.clicked = true
      } else {
        this.clicked = false
      }
    } else {
      this.hovered = false
      this.clicked = false
    }
    if (input.isActive(this.command)) {
      this.clicked = true
    }
  }

  public render(renderer: Renderer) {
    renderer.text(`${this.command + 1} ${this.text}`, this.position, primary[1], this.hovered ? gray[1] : undefined)
  }
}
