import { AiRoundControl } from '../../src/systems/ai-round-control'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { mockComponent, mockReturnValue, mockQueries, mockRandom, mockImplementation, mockReturnValues } from '../mocks'
import { Storage } from '../../src/ecs/storage'
import { HasActionComponent, SelectedActionComponent, actions } from '../../src/components/action'
import { EquipedItemsComponent } from '../../src/components/items'
import { PositionComponent } from '../../src/components/position'
import { Vector } from '../../src/spatial'
import { Random } from '../../src/random'
import { Queries } from '../../src/renderer/queries'
import { TakeTurnComponent } from '../../src/components/rounds'

describe('AiRoundControl', () => {
  let world: TlbWorld

  const availableActions = [
    {
      entity: 2,
      description: 'someBoots',
      name: 'someBoots',
      items: [{ action: actions.hitAndRun, available: true }],
    },
    {
      entity: 2,
      description: 'someWeapon',
      name: 'someWeapon',
      items: [{ action: actions.shoot, available: true }],
    },
  ]

  let scripts: Storage<{}>
  let takeTurns: Storage<{}>
  let hasAction: Storage<HasActionComponent>
  let equipment: Storage<EquipedItemsComponent>
  let selectedAction: Storage<SelectedActionComponent>
  let position: Storage<PositionComponent>
  let system: AiRoundControl
  let random: Random
  let queries: Queries
  beforeEach(() => {
    world = new World()
    queries = mockQueries()
    random = mockRandom()
    system = new AiRoundControl(queries, random)

    scripts = mockComponent(world, 'script')
    takeTurns = mockComponent(world, 'take-turn')
    hasAction = mockComponent(world, 'has-action')
    equipment = mockComponent(world, 'equiped-items')
    selectedAction = mockComponent(world, 'selected-action')
    position = mockComponent(world, 'position')

    mockReturnValue<HasActionComponent>(hasAction.get, { actions: ['endTurn', 'hit'] })
    mockReturnValue<EquipedItemsComponent>(equipment.get, { equipment: [] })
  })

  describe('update', () => {
    beforeEach(() => {
      system.selectAction = jest.fn()
      system.takeAction = jest.fn()
      system.endTurn = jest.fn()
    })

    it('does nothing if is scripting', () => {
      mockReturnValue(scripts.get, {})
      mockReturnValue(takeTurns.get, {})

      system.update(world, 0)

      expect(system.selectAction).not.toHaveBeenCalled()
      expect(system.takeAction).not.toHaveBeenCalled()
      expect(system.endTurn).not.toHaveBeenCalled()
    })

    it('selects action if actions are available but not yet selected', () => {
      mockReturnValue(takeTurns.get, { movements: 1, actions: 0 })

      system.update(world, 0)

      expect(system.selectAction).toHaveBeenCalled()
    })

    it('takes action if one has been selected', () => {
      mockReturnValue(takeTurns.get, { movements: 1, actions: 0 })
      mockReturnValue(selectedAction.get, {})

      system.update(world, 0)

      expect(system.takeAction).toHaveBeenCalled()
    })

    it('ends turn if no actions are available', () => {
      mockReturnValue(takeTurns.get, { movements: 0, actions: 0 })

      system.update(world, 0)

      expect(system.endTurn).toHaveBeenCalled()
    })
  })

  describe('selectAction', () => {
    beforeEach(() => {
      system.endTurn = jest.fn()
      system.findTarget = jest.fn()
      mockImplementation(random.pick, (a: object[]) => a[0])
    })

    it('ends turn if no target is found', () => {
      mockReturnValue(position.get, { position: new Vector([1, 2]) })
      mockReturnValue(system.findTarget, undefined)

      system.selectAction(world, 0, [])

      expect(system.endTurn).toHaveBeenCalled()
    })

    it('tries to get closer if that is possible', () => {
      const aiPosition = { position: new Vector([1, 2]) }
      const targetPosition = { position: new Vector([3, 4]) }
      mockReturnValues(position.get, aiPosition, targetPosition)
      mockReturnValue(system.findTarget, 1)

      system.selectAction(world, 0, availableActions)

      expect(selectedAction.insert).toHaveBeenCalledWith(0, {
        target: 1,
        currentSubAction: 0,
        selection: { action: availableActions[0].items[0].action, entity: 2 },
        skippedActions: 0,
      })
    })

    it('ends turn if it has no line of sight and cannot get closer', () => {
      const aiPosition = { position: new Vector([3, 3]) }
      const targetPosition = { position: new Vector([3, 4]) }
      mockReturnValues(position.get, aiPosition, targetPosition)
      mockReturnValue(system.findTarget, 1)

      system.selectAction(world, 0, availableActions)

      expect(system.endTurn).toHaveBeenCalled()
    })

    it('tries to move closer if that is possible', () => {
      const aiPosition = { position: new Vector([3, 3]) }
      const targetPosition = { position: new Vector([3, 4]) }
      mockReturnValue(queries.ray, { cost: 0 })
      mockReturnValues(position.get, aiPosition, targetPosition)
      mockReturnValue(system.findTarget, 1)

      system.selectAction(world, 0, availableActions)

      // hit and run contains movement
      expect(selectedAction.insert).toHaveBeenCalledWith(0, {
        target: 1,
        currentSubAction: 0,
        selection: { action: availableActions[0].items[0].action, entity: 2 },
        skippedActions: 0,
      })
    })
  })

  describe('takeAction', () => {
    let takeTurn: TakeTurnComponent
    let action: SelectedActionComponent
    beforeEach(() => {
      takeTurn = {
        movements: 10,
        actions: 10,
      }
      action = {
        target: 1,
        currentSubAction: -1,
        selection: { action: availableActions[0].items[0].action, entity: 2 },
        skippedActions: 0,
      }
      system.move = jest.fn()
      system.attack = jest.fn()
    })

    it('calls attack if that is the current action', () => {
      action.currentSubAction = 0

      system.takeAction(world, 0, takeTurn, action)

      expect(system.attack).toHaveBeenCalled()
      expect(action.currentSubAction).toEqual(1)
    })

    it('calls attack if that is the current action', () => {
      action.currentSubAction = 1

      system.takeAction(world, 0, takeTurn, action)

      expect(system.move).toHaveBeenCalled()
      expect(action.currentSubAction).toEqual(2)
    })

    it('consumes action cost and resets selected action', () => {
      action.currentSubAction = 2

      system.takeAction(world, 0, takeTurn, action)

      expect(takeTurn).toEqual({ movements: 7, actions: 7 })
      expect(selectedAction.remove).toHaveBeenCalledWith(0)
    })

    it('consumes all action cost if action demands it', () => {
      action.currentSubAction = 2
      action.selection!.action = actions.endTurn

      system.takeAction(world, 0, takeTurn, action)

      expect(takeTurn).toEqual({ movements: 0, actions: 0 })
      expect(selectedAction.remove).toHaveBeenCalledWith(0)
    })
  })

  describe('move', () => {
    it('adds shortest path to script', () => {
      const sourcePosition = new Vector([2, 3])
      const targetPosition = new Vector([4, 5])
      const path = [new Vector([3, 4])]
      mockReturnValues(position.get, { position: sourcePosition }, { position: targetPosition })
      mockReturnValue(queries.shortestPath, { path })

      system.move(world, 0, 1, { kind: 'movement', range: 3 })

      expect(scripts.insert).toHaveBeenCalledWith(0, { path })
    })
  })
})
