import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { FovComponent } from '../components/fov'
import { State } from '../game-states/state'
import { Entity } from '../ecs/entity'
import { AiComponent } from '../components/ai'
import { turnBasedEntities } from '../component-reducers/turn-based'
import { WorldMapResource, Level, WorldMap } from '../resources/world-map'
import { UIResource, runDialog } from '../resources/ui'
import { Random } from '../random'
import { engage } from '../component-reducers/ai'

export class Npc implements TlbSystem {
  public readonly components: ComponentName[] = ['npc', 'ai', 'position', 'fov']

  public constructor(public readonly random: Random, public readonly pushState: (state: State) => void) {}

  public update(world: TlbWorld, entity: Entity): void {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const fov = world.getComponent<FovComponent>(entity, 'fov')!
    const ai = world.getComponent<AiComponent>(entity, 'ai')!

    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const level: Level = map.levels[position.level]

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
              ai.authorized.add(ai.interest)
              ai.interest = undefined
            }
          }
        }
      })
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
                ai.authorized.add(ai.interest)
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
}
