import { registerComponents, TlbWorld } from '../../src/tlb'
import { Entity } from '../../src/ecs/entity'
import { World } from '../../src/ecs/world'
import { characterCreators } from '../../src/assets/characters'
import { Trigger } from '../../src/systems/trigger'
import { Uniform } from '../../src/random/distributions'
import { Random } from '../../src/random'
import { addDialog, AnswerType } from '../../src/assets/dialogs'
import { mockUi, mockReturnValue, callArgument } from '../mocks'
import { UI } from '../../src/resources/ui'
import { State } from '../../src/game-states/state'
import { TriggeredByComponent } from '../../src/components/trigger'

describe('Trigger', () => {
  let world: TlbWorld
  let player: Entity
  let guard: Entity
  let ui: UI
  let pushState: () => void
  beforeEach(() => {
    world = new World()
    registerComponents(world)
    ui = mockUi(world)

    player = characterCreators.player(world)
    guard = characterCreators.guard(world)
    world.editEntity(player).withComponent('start-turn', {})
    pushState = jest.fn()
  })

  describe('dialog triggers', () => {
    it('opens a dialog modal', () => {
      addDialog(world, guard, 'randomRemarks')
      world.editEntity(guard).withComponent<TriggeredByComponent>('triggered-by', { entity: player })

      const trigger = new Trigger(new Random(new Uniform('1')), pushState)
      trigger.update(world, guard)

      expect(ui.showDialogModal).toHaveBeenCalled()
      expect((callArgument(pushState, 0, 0) as State).name).toEqual('modal')
    })

    it('closes dialog', () => {
      mockReturnValue<boolean>(ui.dialogShowing, true)
      mockReturnValue<AnswerType>(ui.dialogResult, 'close')
      addDialog(world, guard, 'randomRemarks')
      world.editEntity(guard).withComponent<TriggeredByComponent>('triggered-by', { entity: player })

      const trigger = new Trigger(new Random(new Uniform('1')), pushState)
      trigger.update(world, guard)

      expect(world.hasComponent(guard, 'active')).toBeFalsy()
      expect(world.hasComponent(guard, 'triggered-by')).toBeFalsy()
    })

    it('handles attack result', () => {
      mockReturnValue<boolean>(ui.dialogShowing, true)
      mockReturnValue<AnswerType>(ui.dialogResult, 'attack')
      addDialog(world, guard, 'randomRemarks')
      world.editEntity(guard).withComponent<TriggeredByComponent>('triggered-by', { entity: player })

      const trigger = new Trigger(new Random(new Uniform('1')), pushState)
      trigger.update(world, guard)

      expect(world.hasComponent(guard, 'wait-turn')).toBeTruthy()
      expect(world.hasComponent(player, 'start-turn')).toBeTruthy()
    })
  })
})
