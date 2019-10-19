import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { FovComponent } from '../components/fov'
import { State } from '../game-states/state'
import { Fighting } from '../game-states/fighting'
import { Entity } from '../ecs/entity'
import { AiComponent } from '../components/ai'
import { turnBasedEntities } from '../component-reducers/turn-based'
import { WorldMapResource, Level, WorldMap } from '../resources/world-map'
import { UI, UIResource } from '../resources/ui'
import { dialogs } from '../assets/dialogs'
import { Random } from '../random'
import { Modal } from '../game-states/modal'

export class Npc implements TlbSystem {
  public readonly components: ComponentName[] = ['npc', 'ai', 'position', 'fov']

  public constructor(public readonly random: Random, public readonly pushState: (state: State) => void) {}

  public update(world: TlbWorld, entity: Entity): void {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const fov = world.getComponent<FovComponent>(entity, 'fov')!
    const ai = world.getComponent<AiComponent>(entity, 'ai')!

    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const level: Level = map.levels[position.level]

    const ui: UI = world.getResource<UIResource>('ui')

    if (ai.state === 'idle') {
      fov.fov.forEach(f => {
        const character = level.getCharacter(f.position)
        if (character !== undefined && character !== entity) {
          const isPlayer = world.hasComponent(character, 'player')
          if (isPlayer && !ai.authorized.has(character)) {
            ai.interest = character
          }

          const hasAi = world.hasComponent(character, 'ai')
          if (ai.interest !== undefined && hasAi) {
            const otherAi = world.getComponent<AiComponent>(character, 'ai')!
            const isAuthorized = otherAi.authorized.has(ai.interest)
            if (isAuthorized) {
              console.log('reensures', entity, character)
              ai.authorized.add(ai.interest)
              ai.interest = undefined
            }
          }
        }
      })
      if (ai.interest !== undefined) {
        const othersAlreadyFighting = turnBasedEntities(world) > 0
        if (othersAlreadyFighting) {
          this.engage(world, entity, ai)
        } else {
          if (ai.distrust > 9) {
            if (!ui.dialogShowing()) {
              ui.showDialogModal(world, this.random, dialogs.restrictedAreaCheck, ai.interest, entity)
              this.pushState(new Modal(world.activeSystemsList()))
            } else {
              const result = ui.dialogResult()
              if (result !== undefined) {
                ui.hideDialogModal()
              }
              if (result === 'unauthorized') {
                this.engage(world, entity, ai)
                this.pushState(new Fighting())
              } else if (result === 'authorized') {
                ai.authorized.add(ai.interest)
                ai.interest = undefined
                ai.distrust = 0
              }
            }
          } else {
            ai.distrust += 1
          }
        }
      }
    }
  }

  private engage(world: TlbWorld, entity: Entity, ai: AiComponent) {
    ai.state = 'engaging'
    world.editEntity(entity).withComponent('wait-turn', {})
  }
}
