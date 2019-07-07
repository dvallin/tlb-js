import { PlayerRoundControl } from '../../src/systems/player-round-control'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { mockComponent, mockReturnValue, mockQueries, mockRandom } from '../mocks'
import { Storage } from '../../src/ecs/storage'
import { HasActionComponent } from '../../src/components/action'
import { EquipedItemsComponent } from '../../src/components/items'

describe('PlayerRoundControl', () => {
  let world: TlbWorld

  let scripts: Storage<{}>
  let takeTurns: Storage<{}>
  let hasAction: Storage<HasActionComponent>
  let equipment: Storage<EquipedItemsComponent>
  let system: PlayerRoundControl
  beforeEach(() => {
    world = new World()
    const queries = mockQueries()
    const random = mockRandom()
    system = new PlayerRoundControl(queries, random)

    scripts = mockComponent(world, 'script')
    takeTurns = mockComponent(world, 'take-turn')
    hasAction = mockComponent(world, 'has-action')
    equipment = mockComponent(world, 'equiped-items')
  })

  describe('update', () => {
    beforeEach(() => {
      system.doTurn = jest.fn()
      system.endTurn = jest.fn()

      mockReturnValue<HasActionComponent>(hasAction.get, { actions: ['endTurn', 'hit'] })
      mockReturnValue<EquipedItemsComponent>(equipment.get, { equipment: [] })
    })

    it('does nothing if is scripting', () => {
      mockReturnValue(scripts.get, {})
      mockReturnValue(takeTurns.get, {})

      system.update(world, 0)

      expect(system.doTurn).not.toHaveBeenCalled()
      expect(system.endTurn).not.toHaveBeenCalled()
    })

    it('does turn if actions are available', () => {
      mockReturnValue(takeTurns.get, { movements: 1, actions: 0 })

      system.update(world, 0)

      expect(system.doTurn).toHaveBeenCalled()
    })

    it('ends turn if no actions are available', () => {
      mockReturnValue(takeTurns.get, { movements: 0, actions: 0 })

      system.update(world, 0)

      expect(system.endTurn).toHaveBeenCalled()
    })
  })
})
