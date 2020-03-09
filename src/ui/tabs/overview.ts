import { Renderer } from '../../renderer/renderer'
import { Vector } from '../../spatial'
import { Entity } from '../../ecs/entity'
import { TlbWorld } from '../../tlb'
import { CharacterStatsComponent } from '../../components/character-stats'
import { TakeTurnComponent } from '../../components/rounds'
import { primary } from '../../renderer/palettes'
import { KeyboardCommand } from '../../resources/input'
import { Rectangle } from '../../geometry/rectangle'
import { FeatureComponent, FeatureProvider } from '../../components/feature'
import { ActiveEffectsComponent } from '../../components/effects'
import { renderBodyPartInfo } from '../render-helpers'
import { Tab, TabView, TabsKey } from '../tabs'

export interface State {
  focus: Entity

  stats?: CharacterStatsComponent
  activeEffects?: ActiveEffectsComponent
  takeTurn?: TakeTurnComponent
  enemies: {
    feature?: FeatureProvider
  }[]
}

export class OverviewView implements TabView {
  private readonly state: State

  public constructor(public readonly content: Rectangle, focus: Entity) {
    this.state = {
      focus,
      enemies: [],
    }
  }

  public render(renderer: Renderer): void {
    let delta = new Vector([0, 0])
    const down = new Vector([0, 1])
    const right = new Vector([15, 0])

    if (this.state.stats !== undefined) {
      const stats = this.state.stats
      Object.keys(stats.current.bodyParts).forEach(key => {
        renderBodyPartInfo(renderer, this.content.topLeft.add(delta), key, stats, this.state.activeEffects!)
        delta = delta.add(down)
      })
      const globalEffects = this.state
        .activeEffects!.effects.filter(e => e.effect.global)
        .map(e => e.effect.type[0])
        .join()
      renderer.text('effects', this.content.topLeft.add(delta), primary[1])
      renderer.text(`${globalEffects}`, this.content.topLeft.add(delta).add(right), primary[2])

      delta = delta.add(right.mult(2))
    }

    delta = new Vector([delta.x, 0])

    if (this.state.stats !== undefined && this.state.takeTurn !== undefined) {
      renderer.text(
        `${this.state.takeTurn.acted ? 'action taken' : 'can act'} ${this.state.takeTurn.acted ? 'already moved' : 'can move'}`,
        this.content.topLeft.add(delta),
        primary[1]
      )
      delta = delta.add(down)
      this.state.enemies.forEach(enemy => {
        if (enemy.feature !== undefined) {
          const d = this.content.topLeft.add(delta)
          renderer.character(enemy.feature().character, d, enemy.feature().diffuse)
          renderer.text(enemy.feature().name, d.add(new Vector([3, 0])), primary[1])
          delta = delta.add(down)
        }
      })
    }
  }

  public update(world: TlbWorld): void {
    this.state.takeTurn = world.getComponent<TakeTurnComponent>(this.state.focus, 'take-turn')
    this.state.enemies = []
    world.getStorage('took-turn').foreach(entity => {
      const feature = world.getComponent<FeatureComponent>(entity, 'feature') || { feature: undefined }
      this.state.enemies.push({ feature: feature.feature })
    })
    world.getStorage('wait-turn').foreach(entity => {
      const feature = world.getComponent<FeatureComponent>(entity, 'feature') || { feature: undefined }
      this.state.enemies.push({ feature: feature.feature })
    })
    this.state.activeEffects = world.getComponent<ActiveEffectsComponent>(this.state.focus, 'active-effects')
    this.state.stats = world.getComponent<CharacterStatsComponent>(this.state.focus, 'character-stats')
  }
}

export class Overview implements Tab {
  public readonly key: TabsKey = 'overview'
  public readonly name: string = 'overview'
  public readonly shortName: string = 'u'
  public readonly command: KeyboardCommand = 'overview'

  public readonly minimizedHint: TabsKey = 'log'

  public full: OverviewView | undefined
  public minimized: OverviewView | undefined

  public constructor(public readonly focus: Entity) {}

  public setFull(content: Rectangle): void {
    this.full = new OverviewView(content, this.focus)
  }

  public setMinimized(content: Rectangle): void {
    this.minimized = new OverviewView(content, this.focus)
  }
}
