import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { State } from '../game-states/state'
import { Entity } from '../ecs/entity'
import { AiComponent } from '../components/ai'
import { turnBasedEntities } from '../component-reducers/turn-based'
import { UIResource, runDialog, UI } from '../resources/ui'
import { Random } from '../random'
import { engage } from '../component-reducers/ai'
import { Queries } from '../renderer/queries'
import { isAuthorized, authorize } from '../component-reducers/region'

export class Npc implements TlbSystem {
  public readonly components: ComponentName[] = ['npc', 'ai', 'position']

  public constructor(public readonly queries: Queries, public readonly random: Random, public readonly pushState: (state: State) => void) {}

  public update(world: TlbWorld, entity: Entity): void {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const ai = world.getComponent<AiComponent>(entity, 'ai')!

    const ui: UI = world.getResource<UIResource>('ui')

    if (ai.state === 'idle' && !ui.isModal) {
      if (ai.interest === undefined) {
        this.findInterest(world, ai, position)
      } else {
        this.tryToAuthorizeInterest(world, ai, position)
      }
      this.confrontInterest(world, entity, ai, position)
    }
  }

  private findInterest(world: TlbWorld, ai: AiComponent, position: PositionComponent): void {
    world.getStorage('player').foreach(player => {
      if (!isAuthorized(world, position, player)) {
        const playerPosition = world.getComponent<PositionComponent>(player, 'position')
        if (
          playerPosition !== undefined &&
          playerPosition.level === position.level &&
          playerPosition.position.minus(position.position).l1() < 10
        ) {
          const path = this.queries.los(world, position.level, position.position, playerPosition.position, {})
          if (path !== undefined) {
            ai.interest = player
          }
        }
      }
    })
  }

  private tryToAuthorizeInterest(world: TlbWorld, ai: AiComponent, position: PositionComponent): void {
    if (isAuthorized(world, position, ai.interest!)) {
      ai.interest = undefined
      ai.distrust = 0
    }
  }

  private confrontInterest(world: TlbWorld, entity: Entity, ai: AiComponent, position: PositionComponent): void {
    if (ai.interest !== undefined) {
      const othersAlreadyFighting = turnBasedEntities(world) > 0
      if (othersAlreadyFighting) {
        engage(world, entity, ai, this.pushState)
      } else {
        if (ai.distrust > 9) {
          const result = runDialog(
            world.getResource<UIResource>('ui'),
            world,
            this.random,
            'restrictedAreaCheck',
            ai.interest,
            entity,
            this.pushState
          )
          if (result !== undefined) {
            if (result === 'authorized') {
              authorize(world, position, ai.interest!)
              ai.interest = undefined
              ai.distrust = 0
            } else {
              engage(world, entity, ai, this.pushState)
            }
          }
        } else {
          ai.distrust += 1
        }
      }
    }
  }
}
