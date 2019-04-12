import { PlayerRoundControl } from '../../src/systems/player-round-control'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { mockComponent, mockReturnValue, mockQueries, mockUi } from '../mocks'
import { Storage } from '../../src/ecs/storage'
import { ScriptComponent, SelectedActionComponent } from '../../src/components/action'
import { TakeTurnComponent } from '../../src/components/rounds'
import { UI } from '../../src/resources/ui'

describe('PlayerRoundControl', () => {
  let world: TlbWorld

  let scripts: Storage<{}>
  let takeTurns: Storage<{}>
  let system: PlayerRoundControl
  beforeEach(() => {
    world = new World()
    const queries = mockQueries()
    system = new PlayerRoundControl(queries)

    scripts = mockComponent<ScriptComponent>(world, 'script')
    takeTurns = mockComponent<TakeTurnComponent>(world, 'take-turn')
  })

  describe('update', () => {
    beforeEach(() => {
      system.doTurn = jest.fn()
      system.endTurn = jest.fn()
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

  describe('calculateAvailableActions', () => {
    it('adds move action', () => {
      expect(system.calculateAvailableActions({ actions: 0, movements: 1 })).toEqual(['move'])
    })
    it('adds use actions', () => {
      expect(system.calculateAvailableActions({ actions: 1, movements: 0 })).toEqual(['melee', 'nail-gun'])
    })
  })

  describe('doTurn', () => {
    let ui: UI
    let selectedActions: Storage<SelectedActionComponent>
    beforeEach(() => {
      ui = mockUi(world)
      selectedActions = mockComponent<SelectedActionComponent>(world, 'selected-action')
    })

    describe('if no selected action component is available', () => {
      it('shows action dialog with end turn', () => {
        system.doTurn(world, 0, { actions: 0, movements: 0 }, ['move'])

        expect(ui.showSelectList).toHaveBeenCalledWith(world, ['move', 'end-turn'])
      })
      it('inserts an empty selected action component', () => {
        system.doTurn(world, 0, { actions: 0, movements: 0 }, ['move'])

        expect(selectedActions.insert).toHaveBeenCalledWith(0, {})
      })
    })

    describe('if selected action component is empty', () => {
      let selectedAction: SelectedActionComponent
      beforeEach(() => {
        selectedAction = {}
        mockReturnValue(selectedActions.get, selectedAction)
      })

      it('does nothing if no selection is present', () => {
        system.doTurn(world, 0, { actions: 0, movements: 0 }, ['move'])
        expect(selectedAction.type).toBeUndefined()
        expect(ui.hideSelectList).not.toHaveBeenCalled()
      })

      it('does nothing if selection is unknown', () => {
        mockReturnValue(ui.selectListSelection, 'special-attack-2')
        system.doTurn(world, 0, { actions: 0, movements: 0 }, ['move'])
        expect(selectedAction.type).toBeUndefined()
        expect(ui.hideSelectList).toHaveBeenCalled()
      })

      it('selects move type', () => {
        mockReturnValue(ui.selectListSelection, 'move')
        system.doTurn(world, 0, { actions: 0, movements: 0 }, ['move'])
        expect(selectedAction.type).toEqual('move')
        expect(ui.hideSelectList).toHaveBeenCalled()
      })

      it('selects end-turn type', () => {
        mockReturnValue(ui.selectListSelection, 'end-turn')
        system.doTurn(world, 0, { actions: 0, movements: 0 }, ['move'])
        expect(selectedAction.type).toEqual('end-turn')
        expect(ui.hideSelectList).toHaveBeenCalled()
      })

      it('selects use type', () => {
        mockReturnValue(ui.selectListSelection, 'melee')
        system.doTurn(world, 0, { actions: 0, movements: 0 }, ['melee'])
        expect(selectedAction.type).toEqual('use')
        expect(selectedAction.using).toEqual(0)
        expect(ui.hideSelectList).toHaveBeenCalled()
      })
    })

    describe('end turn is selected', () => {
      it('consumes all actions and movements', () => {
        mockReturnValue(selectedActions.get, { type: 'end-turn' })
        const takeTurn = { actions: 1, movements: 2 }

        system.doTurn(world, 0, takeTurn, ['move'])

        expect(takeTurn).toEqual({ actions: 0, movements: 0 })
        expect(selectedActions.remove).toHaveBeenCalledWith(0)
      })
    })

    describe('move is selected', () => {
      it('calls move', () => {
        system.move = jest.fn()
        mockReturnValue(selectedActions.get, { type: 'move' })
        system.doTurn(world, 0, { actions: 1, movements: 2 }, ['move'])

        expect(system.move).toHaveBeenCalled()
        expect(selectedActions.remove).not.toHaveBeenCalledWith(0)
      })
    })

    describe('use is selected', () => {
      it('calls use', () => {
        system.use = jest.fn()
        mockReturnValue(selectedActions.get, { type: 'use' })
        system.doTurn(world, 0, { actions: 1, movements: 2 }, ['move'])

        expect(system.use).toHaveBeenCalled()
        expect(selectedActions.remove).not.toHaveBeenCalledWith(0)
      })
    })
  })
})
