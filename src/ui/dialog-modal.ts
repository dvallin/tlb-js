import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'
import { Renderer } from '../renderer/renderer'
import { primary, gray } from '../renderer/palettes'

import { UIElement } from './ui-element'
import { TlbWorld } from '../tlb'

import { WindowDecoration } from './window-decoration'
import { ItemSelector } from './selector'
import { Dialog, Result, Answer, Step, dialogs } from '../assets/dialogs'
import { Random } from '../random'
import { Rectangle } from '../geometry/rectangle'

interface DialogState {
  steps: Step[]
  current: number
}

export class DialogModal implements UIElement {
  public closed: boolean = false
  public result: Answer | undefined = undefined

  private dialogState: DialogState = { steps: [], current: 0 }
  private currentText: string | undefined
  private selectY: number = 0

  public selector: ItemSelector<Result> | undefined

  public constructor(
    world: TlbWorld,
    private readonly random: Random,
    private readonly window: WindowDecoration,
    dialog: Dialog,
    private readonly player: Entity,
    private readonly owner: Entity
  ) {
    this.startDialog(world, dialog)
  }

  public render(renderer: Renderer) {
    this.window.render(renderer)

    const step = this.dialogState.steps[this.dialogState.current]
    if (this.currentText === undefined) {
      this.currentText = this.random.pick(step.text)
    }

    let y = renderer.flowText(this.currentText, this.window.content.topLeft, this.window.width, primary[1]) + 1
    if (this.selector !== undefined) {
      this.selectY = y
      step.answers.forEach((answer, i) => {
        renderer.text(
          `${i + 1} ${answer.text}`,
          this.window.content.topLeft.add(new Vector([0, y])),
          primary[1],
          this.selector!.hoveredIndex === i ? gray[1] : undefined
        )
        y++
      })
    }
  }

  public update(world: TlbWorld) {
    const step = this.dialogState.steps[this.dialogState.current]
    if (this.selector === undefined) {
      this.selector = new ItemSelector(step.answers)
    }
    this.selector.update(
      world,
      new Rectangle(this.window.content.x, this.window.content.y + this.selectY, this.window.content.width, step.answers.length)
    )
    const result = this.selector.selected
    if (result !== undefined) {
      const navigation = result.type
      if (typeof navigation === 'number') {
        this.navigate(navigation)
      } else if (result.type === 'next_dialog') {
        this.startDialog(world, dialogs[result.dialog])
      } else {
        this.closed = true
        this.result = result as Answer
      }
    }
  }

  private navigate(index: number) {
    this.dialogState.current = index
    this.reset()
  }

  private startDialog(world: TlbWorld, dialog: Dialog) {
    this.dialogState = {
      steps: dialog.steps(world, this.player, this.owner),
      current: 0,
    }
    this.reset()
  }

  private reset() {
    this.currentText = undefined
    this.selector = undefined
  }

  public contains(position: Vector): boolean {
    return this.window.containsVector(position)
  }
}
