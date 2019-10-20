import { Entity } from '../ecs/entity'
import { Vector } from '../spatial'
import { Renderer } from '../renderer/renderer'
import { primary, gray } from '../renderer/palettes'

import { UIElement } from './ui-element'
import { TlbWorld } from '../tlb'

import { WindowDecoration } from './window-decoration'
import { ItemSelector } from './selector'
import { Dialog, Answer, AnswerType } from '../assets/dialogs'
import { Random } from '../random'

export interface State {}

export class DialogModal implements UIElement {
  public closed: boolean = false
  public result: AnswerType | undefined = undefined

  private currentText: string = ''
  private currentAnswers: Answer[] = []

  public selector: ItemSelector<Answer> | undefined

  public constructor(
    world: TlbWorld,
    private readonly random: Random,
    private readonly window: WindowDecoration,
    private readonly dialog: Dialog,
    private readonly player: Entity,
    private readonly npc: Entity
  ) {
    this.select(world, 0)
  }

  public render(renderer: Renderer) {
    this.window.render(renderer)

    let y = renderer.flowText(this.currentText, this.window.content.topLeft, this.window.width, primary[1]) + 1
    if (this.selector !== undefined) {
      this.currentAnswers.forEach((answer, i) => {
        renderer.text(
          `${i + 1} ${answer.text}`,
          this.window.content.topLeft.add(new Vector([0, y])),
          primary[1],
          this.selector!.hoveredIndex === y ? gray[1] : undefined
        )
        y++
      })
    }
  }

  public update(world: TlbWorld) {
    if (this.selector === undefined) {
      this.selector = new ItemSelector(this.currentAnswers)
    }
    this.selector.update(world, this.window.content)
    if (this.selector.selected !== undefined) {
      const navigation = this.selector.selected.navigation
      if (typeof navigation === 'number') {
        this.select(world, navigation)
      } else {
        this.closed = true
        this.result = navigation
      }
    }
  }

  private select(world: TlbWorld, index: number) {
    const step = this.dialog.steps[index]
    this.currentText = this.random.pick(step.text)
    this.currentAnswers = step.answers.filter(a => a.check === undefined || a.check(world, this.player, this.npc))
    this.selector = undefined
  }

  public contains(position: Vector): boolean {
    return this.window.containsVector(position)
  }
}
