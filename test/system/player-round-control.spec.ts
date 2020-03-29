import { Uniform } from '../../src/random/distributions'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerComponents } from '../../src/tlb'
import { mockQueries, mockUi, mockReturnValue, mockInput, mockLog, mockImplementation } from '../mocks'
import { PlayerRoundControl } from '../../src/systems/player-round-control'
import { characterCreators, take } from '../../src/assets/characters'
import { Vector } from '../../src/spatial'
import { TakeTurnComponent, SelectionState } from '../../src/components/rounds'
import { SelectedAction } from '../../src/components/action'
import { UI } from '../../src/resources/ui'
import { actions } from '../../src/assets/actions'
import { Entity } from '../../src/ecs/entity'
import { Path } from '../../src/renderer/astar'
import { placeCharacter } from '../../src/component-reducers/place-character'
import { EffectComponent } from '../../src/components/effects'
import { InventoryComponent } from '../../src/components/items'
import { WorldMapResource } from '../../src/resources/world-map'
import { Input, KeyboardCommand } from '../../src/resources/input'
import { ViewportResource } from '../../src/resources/viewport'

describe('PlayerRoundControl', () => {
  let world: TlbWorld
  let player: Entity
  let ui: UI
  let input: Input
  let system: PlayerRoundControl
  beforeEach(() => {
    world = new World()
    registerComponents(world)

    world.registerResource(new ViewportResource(new Vector([4, 4])))
    world.registerResource(new WorldMapResource(4))
    mockLog(world)
    ui = mockUi(world)
    input = mockInput(world)

    player = characterCreators.player(world)
    placeCharacter(world, player, 0, new Vector([0, 0]))
    world.editEntity(player).withComponent<TakeTurnComponent>('take-turn', { acted: false, moved: false, selectionState: undefined })

    system = new PlayerRoundControl(mockQueries(), new Uniform('12'))
  })

  function getSelectionState(): SelectionState | undefined {
    return getTakeTurnComponent().selectionState
  }

  function getTakeTurnComponent(): TakeTurnComponent {
    return world.getComponent<TakeTurnComponent>(player, 'take-turn')!
  }

  function setSelectionState(selectionState: SelectionState | undefined): void {
    world.getComponent<TakeTurnComponent>(player, 'take-turn')!.selectionState = selectionState
  }

  it('initializes selected action and opens selector', () => {
    system.update(world, player)

    expect(getSelectionState()).toBeDefined()
    expect(ui.showActionSelector).toHaveBeenCalledTimes(1)
  })

  it('sets selection and hides selector', () => {
    const selection = { entity: 42, action: actions.endTurn }
    mockReturnValue<SelectedAction>(ui.selectedAction, { entity: 42, action: actions.endTurn })
    setSelectionState({ skippedActions: 0, currentSubAction: 0 })

    system.update(world, player)

    expect(getSelectionState()!.selection).toEqual(selection)
    expect(ui.hideSelectors).toHaveBeenCalledTimes(1)
  })

  describe('end turn action', () => {
    it('endTurn sets acted and moved ', () => {
      const selection = { entity: player, action: actions.endTurn }
      setSelectionState({ skippedActions: 0, currentSubAction: 0, selection })

      system.update(world, player)

      expect(getTakeTurnComponent().acted).toBeTruthy()
      expect(getTakeTurnComponent().moved).toBeTruthy()
      expect(getSelectionState()).toBeUndefined()
    })
  })

  describe('move action', () => {
    it('shows move selector', () => {
      const selection = { entity: player, action: actions.move }
      setSelectionState({ skippedActions: 0, currentSubAction: 0, selection })

      system.update(world, player)

      expect(ui.showMovementSelector).toHaveBeenCalledTimes(1)
    })

    it('creates movement script and increases subaction', () => {
      const selection = { entity: player, action: actions.move }
      setSelectionState({ skippedActions: 0, currentSubAction: 0, selection })
      const path = [new Vector([0, 1]), new Vector([0, 2])]
      mockReturnValue<Path>(ui.selectedMovement, { path, cost: 2 })

      system.update(world, player)

      expect(world.hasComponent(player, 'script')).toBeTruthy()
      expect(getSelectionState()!.currentSubAction).toEqual(1)
    })
  })

  describe('attack action', () => {
    it('shows attack selector', () => {
      const selection = { entity: 42, action: actions.bolt }
      setSelectionState({ skippedActions: 0, currentSubAction: 0, selection })

      system.update(world, player)

      expect(ui.showAttackSelector).toHaveBeenCalledTimes(1)
    })

    it('selects first enemy on path', () => {
      const selection = { entity: 42, action: actions.bolt }
      setSelectionState({ skippedActions: 0, currentSubAction: 0, selection })
      mockReturnValue<Path>(ui.selectedAttack, { path: [new Vector([0, 1]), new Vector([0, 2])], cost: 2 })
      const firstEnemy = characterCreators.guard(world)
      const secondEnemy = characterCreators.guard(world)
      placeCharacter(world, firstEnemy, 0, new Vector([0, 1]))
      placeCharacter(world, secondEnemy, 0, new Vector([0, 2]))

      system.update(world, player)

      expect(getSelectionState()!.target).toEqual(firstEnemy)
    })

    it('applies effects and increases subaction', () => {
      const selection = { entity: 42, action: actions.bolt }
      const target = characterCreators.guard(world)
      setSelectionState({ skippedActions: 0, currentSubAction: 0, selection, target })
      placeCharacter(world, target, 0, new Vector([0, 1]))

      system.update(world, player)

      expect(world.getStorage<EffectComponent>('effect').size()).toEqual(2)
      world.getStorage<EffectComponent>('effect').foreach((_, effect) => {
        expect(effect.source).toEqual(player)
        expect(effect.target).toEqual(target)
      })
      expect(getSelectionState()!.currentSubAction).toEqual(1)
    })
  })

  describe('status action', () => {
    it('shows multiple choice selector', () => {
      const selection = { entity: 42, action: actions.healLimp }
      setSelectionState({ skippedActions: 0, currentSubAction: 0, selection })

      system.update(world, player)

      expect(ui.showMultipleChoiceSelector).toHaveBeenCalledTimes(1)
    })

    it('applies effect and increases subaction', () => {
      const selection = { entity: 42, action: actions.healLimp }
      setSelectionState({ skippedActions: 0, currentSubAction: 0, selection })
      mockReturnValue<Entity>(ui.selectedOption, 0)

      system.update(world, player)

      expect(ui.showMultipleChoiceSelector).toHaveBeenCalledTimes(1)

      expect(world.getStorage<EffectComponent>('effect').size()).toEqual(2)
      world.getStorage<EffectComponent>('effect').foreach((_, effect) => {
        expect(effect.source).toEqual(player)
        expect(effect.target).toEqual(player)
      })
      expect(getSelectionState()!.currentSubAction).toEqual(1)
    })

    it('consumes item', () => {
      const bandages = take(world, player, 'bandages')
      const selection = { entity: bandages, action: actions.healLimp }
      setSelectionState({ skippedActions: 0, currentSubAction: 0, selection })
      mockReturnValue<Entity>(ui.selectedOption, 0)

      system.update(world, player)

      expect(ui.showMultipleChoiceSelector).toHaveBeenCalledTimes(1)

      world.getComponent<InventoryComponent>(player, 'inventory')!.content.every(e => e !== bandages)
    })
  })

  describe('skip action', () => {
    it('increases subaction and skipped action', () => {
      const selection = { entity: 42, action: actions.healLimp }
      setSelectionState({ skippedActions: 0, currentSubAction: 0, selection })
      mockImplementation<KeyboardCommand, boolean>(input.isActive, key => key === 'cancel')

      system.update(world, player)

      expect(getSelectionState()!.currentSubAction).toEqual(1)
      expect(getSelectionState()!.skippedActions).toEqual(1)
    })
  })

  describe('acted and moved fields', () => {
    it('actions are taken if not all subactions are skipped', () => {
      const selection = { entity: 42, action: actions.hitAndRun }
      setSelectionState({ skippedActions: 1, currentSubAction: 2, selection })

      system.update(world, player)

      expect(getTakeTurnComponent().acted).toBeTruthy()
      expect(getTakeTurnComponent().moved).toBeFalsy()
    })

    it('actions are not taken if all subactions are skipped', () => {
      const selection = { entity: 42, action: actions.hitAndRun }
      setSelectionState({ skippedActions: 2, currentSubAction: 2, selection })

      system.update(world, player)

      expect(getTakeTurnComponent().acted).toBeFalsy()
      expect(getTakeTurnComponent().moved).toBeFalsy()
    })

    it('cost all actions are correctly taken', () => {
      const selection = { entity: 42, action: actions.rush }
      setSelectionState({ skippedActions: 0, currentSubAction: 1, selection })

      system.update(world, player)

      expect(getTakeTurnComponent().acted).toBeTruthy()
      expect(getTakeTurnComponent().moved).toBeTruthy()
    })
  })

  it('ends turn if no moved and acted', () => {
    world.editEntity(player).withComponent<TakeTurnComponent>('take-turn', { acted: true, moved: true, selectionState: undefined })

    system.update(world, player)

    expect(world.hasComponent(player, 'took-turn')).toBeTruthy()
    expect(world.hasComponent(player, 'take-turn')).toBeFalsy()
  })
})
